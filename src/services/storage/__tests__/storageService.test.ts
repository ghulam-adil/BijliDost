import { createStorageService } from '../storageService';
import {
  DATABASE_KEY_NAME,
  createFakeDriver,
  createFakeKeyStore,
  createFakeRandom,
  createWorld,
  hex,
  FakeWorld,
} from './fakes';

function service(world: FakeWorld, isSupported = true) {
  return createStorageService({
    driver: createFakeDriver(world),
    keyStore: createFakeKeyStore(world),
    random: createFakeRandom(),
    isSupported,
  });
}

describe('storageService.bootstrap', () => {
  it('returns ready with a repository on a fresh install', async () => {
    const result = await service(createWorld()).bootstrap();
    expect(result.status).toBe('ready');
  });

  it('returns unsupported on platforms without encrypted storage, without opening anything', async () => {
    const world = createWorld();
    const result = await service(world, false).bootstrap();
    expect(result.status).toBe('unsupported');
    expect(world.opened).toBe(0);
  });

  it('returns fatal (and keeps the DB closed) when SQLCipher is unavailable', async () => {
    const world = createWorld({ cipher: null });
    const result = await service(world).bootstrap();
    expect(result.status).toBe('fatal');
    expect(world.secrets.size).toBe(0);
  });

  it('returns a recovery state, not an erase, for an orphaned database', async () => {
    const world = createWorld({ fileKey: hex('e') });
    const result = await service(world).bootstrap();
    expect(result).toEqual({ status: 'recovery', reason: 'orphaned-database' });
    expect(world.events).not.toContain('db:delete');
  });
});

describe('storageService.eraseAll', () => {
  it('deletes the database file before the key, then allows a clean bootstrap', async () => {
    const world = createWorld({ fileKey: hex('e') });
    const svc = service(world);

    await svc.bootstrap(); // orphaned
    await svc.eraseAll();

    const order = world.events;
    expect(order.indexOf('db:delete')).toBeGreaterThan(-1);
    expect(order.indexOf('db:delete')).toBeLessThan(order.indexOf('key:delete'));
    expect(world.secrets.has(DATABASE_KEY_NAME)).toBe(false);

    const result = await svc.bootstrap();
    expect(result.status).toBe('ready');
    expect(world.secrets.has(DATABASE_KEY_NAME)).toBe(true);
  });

  it('leaves the key in place if the database could not be deleted', async () => {
    const world = createWorld({ fileKey: hex('c') });
    world.secrets.set(DATABASE_KEY_NAME, hex('c'));
    const driver = createFakeDriver(world);
    const svc = createStorageService({
      driver: { ...driver, deleteDatabaseAsync: async () => { throw new Error('disk error'); } },
      keyStore: createFakeKeyStore(world),
      random: createFakeRandom(),
      isSupported: true,
    });

    await expect(svc.eraseAll()).rejects.toThrow('disk error');
    expect(world.secrets.get(DATABASE_KEY_NAME)).toBe(hex('c'));
  });

  it('ignores a database file that is already gone', async () => {
    const world = createWorld();
    const driver = createFakeDriver(world);
    const svc = createStorageService({
      driver: { ...driver, deleteDatabaseAsync: async () => { throw new Error('Database does not exist'); } },
      keyStore: createFakeKeyStore(world),
      random: createFakeRandom(),
      isSupported: true,
    });

    await expect(svc.eraseAll()).resolves.toBeUndefined();
  });
});
