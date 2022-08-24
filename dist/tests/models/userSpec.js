"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../models/user");
const store = new user_1.UserStore();
describe('- User Model Tests', () => {
    let user_id;
    const user = {
        first_name: 'Mahmoud',
        last_name: 'Elbagoury',
        password: 'password',
    };
    it('Should create a user with correct name', async () => {
        const newUser = await store.create(user);
        expect(newUser.first_name).toBe(user.first_name);
        expect(newUser.last_name).toBe(user.last_name);
        user_id = newUser.id;
    });
    it('Index should return at least 1 user (we just created 1)', async () => {
        const users = await store.index();
        expect(users[0]).toBeTruthy();
    });
    it('Accept right password', async () => {
        await expectAsync(store.authenticate(user)).toBeResolved();
    });
    it('Reject wrong password', async () => {
        const log_user = {
            first_name: 'zizo',
            last_name: 'mizo',
            password: 'pa$$word',
        };
        await expectAsync(store.authenticate(log_user)).toBeRejected();
    });
    it('Show user', async () => {
        const user = await store.show(user_id);
        expect(user.id).toBe(user_id);
    });
    it('Update user', async () => {
        const update_user = {
            id: user_id,
            first_name: 'mido',
            last_name: 'lol',
        };
        const newUser = await store.update(update_user);
        expect([newUser.first_name, newUser.last_name]).toEqual(['mido', 'lol']);
    });
    it('Delete user', async () => {
        const user = await store.delete(user_id);
        expect(user.id).toBe(user_id);
    });
});
