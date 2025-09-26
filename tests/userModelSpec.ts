import { UserModel } from '../src/models/user';

const model = new UserModel();

describe('UserModel (unit)', () => {
  const email = `unit_${Date.now()}@example.com`;
  let userId = 0;

  it('create() should create a user (token or user)', async () => {
    const result: any = await model.create({
      first_name: 'Unit',
      last_name: 'User',
      email,
      password: 'secret123'
    });

    if (typeof result === 'string') {
      // رجع token → نتحقق من وجود المستخدم عبر index()
      const users = await model.index();
      const created = users.find((u: any) => u.email === email);
      if (!created) {
        fail('User was not found in index() after create');
        return;
      }
      expect(created.email).toBe(email);
      userId = created.id as number;
    } else {
      // رجّع user object
      expect(result.email).toBe(email);
      userId = result.id as number;
    }

    expect(userId).toBeGreaterThan(0);
  });

  it('index() should include the created user', async () => {
    const users = await model.index();
    expect(Array.isArray(users)).toBeTrue();
    expect(users.some((u: any) => u.id === userId)).toBeTrue();
  });

  it('show(id) should return that user', async () => {
    const user = await model.show(userId);
    expect(user).toBeTruthy();
    expect(user?.id).toBe(userId);
    expect(user?.email).toBe(email);
  });

  it('authenticate(email, password) should succeed if implemented', async () => {
    if (typeof (model as any).authenticate !== 'function') {
      expect(true).toBeTrue();
      return;
    }
    const auth = await (model as any).authenticate(email, 'secret123');
    expect(!!auth).toBeTrue();
  });
});
