import { openEncryptedDatabase } from '../encryptedBillDatabase';
import { createDatabaseKeyManager } from '../databaseKeyManager';
import { FatalSecurityError, StorageIntegrityError } from '../errors';
import { LATEST_SCHEMA_VERSION } from '../migrations';
import {
  DATABASE_KEY_NAME,
  FRESH_KEY,
  createFakeDriver,
  createFakeKeyStore,
  createFakeRandom,
  createWorld,
  hex,
  FakeWorld,
} from './fakes';

function open(world: FakeWorld) {
  const keys = createDatabaseKeyManager(createFakeKeyStore(world), createFakeRandom());
  return openEncryptedDatabase({ driver: createFakeDriver(world), keys });
}

describe('openEncryptedDatabase - mandatory fail-closed sequence', () => {
  it('State 2 (fresh install): generates a key, proves access, persists the key, then migrates', async () => {
    const world = createWorld();
    const result = await open(world);

    expect(result.status).toBe('ready');
    expect(world.secrets.get(DATABASE_KEY_NAME)).toBe(FRESH_KEY);
    expect(world.userVersion).toBe(LATEST_SCHEMA_VERSION);

    const order = world.events;
    const iCipher = order.indexOf('sql:PRAGMA cipher_version');
    const iKey = order.indexOf('sql:PRAGMA key');
    const iRead = order.indexOf('sql:read schema');
    const iPersist = order.indexOf('key:set');
    const iMigrate = order.indexOf('tx:begin');
    expect(iCipher).toBeGreaterThan(-1);
    expect(iCipher).toBeLessThan(iKey);
    expect(iKey).toBeLessThan(iRead);
    expect(iRead).toBeLessThan(iPersist);
    expect(iPersist).toBeLessThan(iMigrate);
  });

  it('State 1 (normal): reuses the stored key and does not write a new one', async () => {
    const world = createWorld({ fileKey: hex('c'), userVersion: LATEST_SCHEMA_VERSION });
    world.secrets.set(DATABASE_KEY_NAME, hex('c'));

    const result = await open(world);

    expect(result.status).toBe('ready');
    expect(world.events).not.toContain('key:set');
    expect(world.events).not.toContain('tx:begin'); // already at latest schema
  });

  it('State 3 (missing DB + existing key): reuses the key to create a new encrypted DB', async () => {
    const world = createWorld({ fileKey: null });
    world.secrets.set(DATABASE_KEY_NAME, hex('d'));

    const result = await open(world);

    expect(result.status).toBe('ready');
    expect(world.fileKey).toBe(hex('d'));
    expect(world.secrets.get(DATABASE_KEY_NAME)).toBe(hex('d'));
    expect(world.events).not.toContain('key:set');
  });

  it('State 4 (orphaned encrypted DB, key lost): halts, never overwrites or deletes, persists no key', async () => {
    const world = createWorld({ fileKey: hex('e') });

    const result = await open(world);

    expect(result.status).toBe('orphaned-database');
    expect(world.fileKey).toBe(hex('e'));
    expect(world.secrets.size).toBe(0);
    expect(world.events).not.toContain('key:set');
    expect(world.events).not.toContain('db:delete');
    expect(world.events).not.toContain('tx:begin');
    expect(world.events[world.events.length - 1]).toBe('close');
  });

  it('State 5 (stored key rejected): halts without deleting the database or changing the key', async () => {
    const world = createWorld({ fileKey: hex('e') });
    world.secrets.set(DATABASE_KEY_NAME, hex('f'));

    const result = await open(world);

    expect(result.status).toBe('access-rejected');
    expect(world.fileKey).toBe(hex('e'));
    expect(world.secrets.get(DATABASE_KEY_NAME)).toBe(hex('f'));
    expect(world.events).not.toContain('db:delete');
    expect(world.events).not.toContain('key:set');
  });

  it('treats a malformed stored key as rejected without opening the database or regenerating', async () => {
    const world = createWorld();
    world.secrets.set(DATABASE_KEY_NAME, 'not-a-valid-key');

    const result = await open(world);

    expect(result.status).toBe('access-rejected');
    expect(world.opened).toBe(0);
    expect(world.secrets.get(DATABASE_KEY_NAME)).toBe('not-a-valid-key');
  });

  it('refuses a database whose schema is newer than the app, without touching it', async () => {
    const world = createWorld({ fileKey: hex('c'), userVersion: LATEST_SCHEMA_VERSION + 1 });
    world.secrets.set(DATABASE_KEY_NAME, hex('c'));

    await expect(open(world)).rejects.toBeInstanceOf(StorageIntegrityError);
    expect(world.events[world.events.length - 1]).toBe('close');
  });
});

describe('openEncryptedDatabase - SQLCipher unavailable (fail closed)', () => {
  it.each([
    ['null', null],
    ['empty string', ''],
    ['whitespace', '   '],
    ['throws', 'throw' as const],
  ])('halts with FatalSecurityError when cipher_version is %s', async (_label, cipher) => {
    const world = createWorld({ cipher });

    await expect(open(world)).rejects.toBeInstanceOf(FatalSecurityError);

    // Nothing was keyed, written, persisted or migrated, and the connection was closed.
    expect(world.events).not.toContain('sql:PRAGMA key');
    expect(world.events).not.toContain('key:set');
    expect(world.events).not.toContain('tx:begin');
    expect(world.fileKey).toBeNull();
    expect(world.secrets.size).toBe(0);
    expect(world.events[world.events.length - 1]).toBe('close');
  });
});
