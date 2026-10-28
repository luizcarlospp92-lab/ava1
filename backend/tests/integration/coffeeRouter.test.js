const express = require('express');
const request = require('supertest');
const { createCoffeeRouter } = require('../../src/coffee/coffeeRouter');
const { createCoffeeService } = require('../../src/coffee/coffeeService');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/coffee', createCoffeeRouter(createCoffeeService()));
  return app;
}

describe('API /api/coffee (integração)', () => {
  test('GET retorna 0 inicialmente', async () => {
    const res = await request(buildApp()).get('/api/coffee');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 0 });
  });

  test('POST incrementa e GET reflete o novo valor', async () => {
    const app = buildApp();
    const post = await request(app).post('/api/coffee');
    expect(post.status).toBe(201);
    expect(post.body).toEqual({ count: 1 });

    const get = await request(app).get('/api/coffee');
    expect(get.body).toEqual({ count: 1 });
  });

  test('POST com cups soma a quantidade', async () => {
    const res = await request(buildApp()).post('/api/coffee').send({ cups: 3 });
    expect(res.body).toEqual({ count: 3 });
  });

  test('POST com cups inválido retorna 400', async () => {
    const res = await request(buildApp()).post('/api/coffee').send({ cups: -2 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cups/);
  });

  test('DELETE zera o contador', async () => {
    const app = buildApp();
    await request(app).post('/api/coffee').send({ cups: 4 });
    const res = await request(app).delete('/api/coffee');
    expect(res.body).toEqual({ count: 0 });
  });
});
