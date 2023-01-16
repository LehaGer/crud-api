import request from 'supertest';
import server from '../server';

describe("application's testing", () => {
  describe('GET /users', () => {
    test('should response with 200 code', async () => {
      const response = await request(server).get('/api/users');
      expect(response.statusCode).toBe(200);
    });
    test('should response empty array', async () => {
      const response = await request(server).get('/api/users');
      expect(response.body).toEqual([]);
    });
  });
  describe('POST /users', () => {
    test('should response with 201 code on create new user', async () => {
      const response = await request(server)
        .post('/api/users')
        .send({
          username: 'Ted',
          age: 25,
          hobbies: ['swimming', 'basketball'],
        });
      expect(response.statusCode).toBe(201);
    });
    test('should get created user', async () => {
      const newUserObj = {
        username: 'Ted',
        age: 25,
        hobbies: ['swimming', 'basketball'],
      };
      await request(server).post('/api/users').send(newUserObj);
      const responseGet = await request(server).get('/api/users');
      expect(responseGet.body[0]).toMatchObject(newUserObj);
    });
  });
  describe('POST /users/{userId}', () => {
    const newUserObj = {
      id: 'f1c5bcff-b26d-4204-a6c5-dbf784a7262d',
      username: 'Ted',
      age: 25,
      hobbies: ['swimming', 'basketball'],
    };
    test('should response with 201 code on create new user', async () => {
      const response = await request(server).post('/api/users').send(newUserObj);
      expect(response.statusCode).toBe(201);
    });
    test('should get created user', async () => {
      await request(server).post(`/api/users`).send(newUserObj);
      const responseGet = await request(server).get(`/api/users/${newUserObj.id}`);
      expect(responseGet.body).toMatchObject(newUserObj);
    });
  });
  describe('PUT /users/{userId}', () => {
    const initialUserObj = {
      id: 'f8356478-4d93-49de-bd64-2a450bea7260',
      username: 'Ted',
      age: 25,
      hobbies: ['swimming', 'basketball'],
    };
    const newUserObj = {
      username: 'Ted',
      age: 27,
      hobbies: ['swimming', 'basketball'],
    };
    test('should response with 200 code on update user', async () => {
      await request(server).post('/api/users').send(initialUserObj);
      const responsePut = await request(server)
        .put(`/api/users/${initialUserObj.id}`)
        .send(newUserObj);
      expect(responsePut.statusCode).toBe(200);
    });
    test('should get updated user', async () => {
      await request(server).post('/api/users').send(initialUserObj);
      await request(server).put(`/api/users/${initialUserObj.id}`).send(newUserObj);
      const responseGet = await request(server).get(`/api/users/${initialUserObj.id}`);
      expect(responseGet.body).toEqual({ id: initialUserObj.id, ...newUserObj });
    });
  });
  describe('DELETE /users/{userId}', () => {
    const initialUserObj = {
      id: 'f8356478-4d93-49de-bd64-2a450bea7260',
      username: 'Ted',
      age: 25,
      hobbies: ['swimming', 'basketball'],
    };
    test('should response with 204 code on delete user', async () => {
      await request(server).post('/api/users').send(initialUserObj);
      const response = await request(server).delete(`/api/users/${initialUserObj.id}`);
      expect(response.statusCode).toBe(204);
    });
    test('should get 404 error om requesting deleted user', async () => {
      await request(server).post('/api/users').send(initialUserObj);
      await request(server).delete(`/api/users/${initialUserObj.id}`);
      const responseGet = await request(server).get(`/api/users/${initialUserObj.id}`);
      expect(responseGet.statusCode).toBe(404);
    });
  });
});
