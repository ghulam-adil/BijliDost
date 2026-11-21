import { createDatabaseKeyManager, isValidKeyHex } from '../databaseKeyManager';
import { FatalSecurityError } from '../errors';
import { DATABASE_KEY_NAME, createFakeKeyStore, createFakeRandom, createWorld, hex } from './fakes';

describe('databaseKeyManager', () => {
  it('reports missing, present and malformed stored keys', async () => {
    const world = createWorld();
    const keys = createDatabaseKeyManager(createFakeKeyStore(world), createFakeRandom());

    expect(await keys.read()).toEqual({ status: 'missing' });

    world.secrets.set(DATABASE_KEY_NAME, hex('1'));
    expect(await keys.read()).toEqual({ status: 'present', key: hex('1') });

    world.secrets.set(DATABASE_KEY_NAME, 'zz');
    expect(await keys.read()).toEqual({ status: 'malformed' });
  });

  it('generates a 256-bit lowercase hex key from secure random bytes', () => {
    const keys = createDatabaseKeyManager(createFakeKeyStore(createWorld()), createFakeRandom(0x0f));
    const key = keys.generate();
    expect(key).toHaveLength(64);
    expect(isValidKeyHex(key)).toBe(true);
    expect(key).toBe('0f'.repeat(32));
  });

  it('fails closed if the random source returns the wrong number of bytes', () => {
    const keys = createDatabaseKeyManager(createFakeKeyStore(createWorld()), {
      getRandomBytes: () => new Uint8Array(8),
    });
    expect(() => keys.generate()).toThrow(FatalSecurityError);
  });

  it('refuses to persist a malformed key (also prevents SQL injection via the key)', async () => {
    const world = createWorld();
    const keys = createDatabaseKeyManager(createFakeKeyStore(world), createFakeRandom());
    await expect(keys.persist(`${hex('a').slice(2)}'";--`)).rejects.toThrow(FatalSecurityError);
    expect(world.secrets.size).toBe(0);
  });

  it('persists and removes the key under the reserved name only', async () => {
    const world = createWorld();
    const keys = createDatabaseKeyManager(createFakeKeyStore(world), createFakeRandom());

    await keys.persist(hex('b'));
    expect([...world.secrets.keys()]).toEqual([DATABASE_KEY_NAME]);

    await keys.remove();
    expect(world.secrets.size).toBe(0);
  });
});
