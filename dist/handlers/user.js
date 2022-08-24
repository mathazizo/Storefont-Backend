"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new user_1.UserStore();
const secret_token = process.env.SECRET_TOKEN;
const create = async (req, res) => {
    try {
        const user = req.body;
        const newUser = await store.create(user);
        const token = jsonwebtoken_1.default.sign(newUser, secret_token);
        if (newUser) {
            res.status(201).json(token);
        }
        else {
            res.status(400).json({ error: 'User was not created' });
        }
    }
    catch (err) {
        res.status(400).json({ error: `User was not created: ${err}` });
    }
};
const index = async (req, res) => {
    try {
        const users = await store.index();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ error: `Could not get users: ${err}` });
    }
};
const show = async (req, res) => {
    try {
        if (req.params.id != res.locals.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        const id = req.params.id;
        const user = await store.show(id);
        delete user.password;
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: `Could not get user: ${err}` });
    }
};
const update = async (req, res) => {
    try {
        if (req.params.id != res.locals.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        const user = req.body;
        const updatedUser = await store.update(user);
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ error: `Could not update user: ${err}` });
    }
};
const del = async (req, res) => {
    try {
        if (req.params.id != res.locals.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        const id = req.params.id;
        const deletedUser = await store.delete(id);
        res.json(deletedUser);
    }
    catch (err) {
        res.status(500).json({ error: `Could not delete user: ${err}` });
    }
};
const authenticatePassword = async (req, res) => {
    try {
        const req_user = req.body;
        const user = await store.authenticate(req_user);
        if (user) {
            const token = jsonwebtoken_1.default.sign(user, secret_token);
            res.status(200).json(token);
        }
        else {
            res.status(400).json({ error: 'User was not authenticated' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not authenticate user: ${err}` });
    }
};
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, secret_token);
        res.locals.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: `Invalid token: ${err}` });
    }
};
exports.verifyToken = verifyToken;
const userRoutes = (app) => {
    app.post('/users', create);
    app.get('/users', exports.verifyToken, index);
    app.get('/users/:id', exports.verifyToken, show);
    app.put('/users/:id', exports.verifyToken, update);
    app.delete('/users/:id', exports.verifyToken, del);
    app.post('/users/authenticate', authenticatePassword);
};
exports.default = userRoutes;
