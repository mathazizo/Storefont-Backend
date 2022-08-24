"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret_token = process.env.SECRET_TOKEN;
const request = (0, supertest_1.default)(server_1.default);
describe('- User Handler:', () => {
    let user_id;
    let token;
    const user = {
        first_name: 'Mariela',
        last_name: 'Del Barrio',
        password: 'oculto',
    };
    it('Create a user', async () => {
        const response = await request.post('/users').send(user);
        expect(response.status).toBe(201);
        token = response.body;
        const decoded = jsonwebtoken_1.default.verify(token, secret_token);
        user_id = decoded.id;
    });
    it('Get all users', async () => {
        const response = await request
            .get('/users')
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        const users = response.body;
        expect(users[0]).toBeTruthy();
    });
    it('Show user by id', async () => {
        const response = await request
            .get(`/users/${user_id}`)
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        const user_1 = response.body;
        expect(user_1.id).toEqual(user_id);
    });
    it('Update user with id', async () => {
        const update_user = {
            id: user_id,
            first_name: 'Mariela',
            last_name: 'Del Barrio Fernandez',
        };
        const response = await request
            .put(`/users/${update_user.id}`)
            .set('Authorization', 'Bearer ' + token)
            .send(update_user);
        expect(response.status).toBe(200);
        const user_1 = response.body;
        expect(user_1.last_name).toEqual('Del Barrio Fernandez');
    });
    it('Block update if id does not match token', async () => {
        const update_user = {
            id: user_id + 1,
            first_name: 'Mariela',
            last_name: 'Del Barrio Fernandez',
        };
        const response = await request
            .put(`/users/${update_user.id}`)
            .set('Authorization', 'Bearer ' + token)
            .send(update_user);
        expect(response.status).toBe(401);
        expect(response.body.error).toEqual('Unauthorized');
    });
    it('Authenticate password and verify token', async () => {
        const response = await request.post('/users/authenticate').send(user);
        expect(response.status).toBe(200);
        const res_token = response.body;
        const decoded = jsonwebtoken_1.default.verify(res_token, secret_token);
        expect(decoded.first_name).toBe(user.first_name);
    });
    it('Delete user by id', async () => {
        const response = await request
            .delete(`/users/${user_id}`)
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        const user_1 = response.body;
        expect(user_1.id).toEqual(user_id);
    });
});
