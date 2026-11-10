
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
import { connectRedis, redisClient } from '../src/config/redis-db.js';

const BASE_URL = '/api/v1';
const TEST_DB = process.env.TEST_DATABASE_CONNECTION_STRING;

let app;
let userAToken;
let userBToken;
let userANoteId;

before(async () => {
    if (!TEST_DB) {
        throw new Error('TEST_DATABASE_CONNECTION_STRING is missing');
    }

    // Connect to the separate test database.
    await mongoose.connect(TEST_DB);

    // Connect Redis before importing the Express application.
    await connectRedis();

    // Import App only after Redis is connected.
    const App = (await import('../src/app.js')).default;

    app = new App().app;

    // Clean the test database.
    await mongoose.connection.dropDatabase();
});

after(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }

    if (redisClient.isOpen) {
        await redisClient.quit();
    }
});

test('User A can register and log in', async () => {
    const registerResponse = await request(app)
        .post(`${BASE_URL}/auth/register`)
        .send({
            name: 'Test User A',
            email: 'testa@example.com',
            password: 'TestPassword123!'
        });

    assert.equal(registerResponse.status, 201);

    const loginResponse = await request(app)
        .post(`${BASE_URL}/auth/login`)
        .send({
            email: 'testa@example.com',
            password: 'TestPassword123!'
        });

    assert.equal(loginResponse.status, 200);

    userAToken = loginResponse.body.data.token;

    assert.ok(userAToken, 'Login should return a JWT token');
});

test('User B can register and log in', async () => {
    const registerResponse = await request(app)
        .post(`${BASE_URL}/auth/register`)
        .send({
            name: 'Test User B',
            email: 'testb@example.com',
            password: 'TestPassword123!'
        });

    assert.equal(registerResponse.status, 201);

    const loginResponse = await request(app)
        .post(`${BASE_URL}/auth/login`)
        .send({
            email: 'testb@example.com',
            password: 'TestPassword123!'
        });

    assert.equal(loginResponse.status, 200);

    userBToken = loginResponse.body.data.token;

    assert.ok(userBToken);
});

test('User A can create and retrieve a note', async () => {
    const createResponse = await request(app)
        .post(`${BASE_URL}/notes`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
            title: 'User A private note',
            content: {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'This is a private test note'
                            }
                        ]
                    }
                ]
            }
        });

    assert.equal(createResponse.status, 201);

    const createdNote =
        createResponse.body.data?.note ??
        createResponse.body.data;

    userANoteId = createdNote._id ?? createdNote.id;

    assert.ok(userANoteId, 'Created note should have an ID');

    const getResponse = await request(app)
        .get(`${BASE_URL}/notes/${userANoteId}`)
        .set('Authorization', `Bearer ${userAToken}`);

    assert.equal(getResponse.status, 200);
});

test('User B cannot access User A note', async () => {
    const response = await request(app)
        .get(`${BASE_URL}/notes/${userANoteId}`)
        .set('Authorization', `Bearer ${userBToken}`);

    assert.equal(response.status, 404);
});
