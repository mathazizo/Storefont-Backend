"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = parseInt(process.env.SALT_ROUNDS);
class UserStore {
    async create(user) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING id, first_name, last_name;';
            const { first_name, last_name, password } = user;
            const password_hash = await bcrypt_1.default.hash(password + pepper, saltRounds);
            const result = await database_1.default.query(sql, [
                first_name,
                last_name,
                password_hash,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create user: ${err}`);
        }
    }
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users';
            const result = await database_1.default.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE id = $1;';
            const result = await database_1.default.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0) {
                throw new Error(`User with id ${id} not found`);
            }
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not get user: ${err}`);
        }
    }
    async update(user) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *;';
            const { first_name, last_name, id } = user;
            const result = await database_1.default.query(sql, [first_name, last_name, id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not update user: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM users WHERE id = $1 RETURNING *;';
            const result = await database_1.default.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not delete user: ${err}`);
        }
    }
    async authenticate(user) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE first_name=$1;';
            const result = await database_1.default.query(sql, [user.first_name]);
            conn.release();
            if (result.rows.length === 0) {
                throw new Error('User not found');
            }
            const selected_user = result.rows[0];
            if (await bcrypt_1.default.compare(user.password + pepper, selected_user.password)) {
                delete selected_user.password;
                return selected_user;
            }
            throw new Error('Password incorrect');
        }
        catch (err) {
            throw new Error(`Could not authenticate user: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
