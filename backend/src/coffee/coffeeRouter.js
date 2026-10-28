'use strict';

const express = require('express');
const { createCoffeeService } = require('./coffeeService');

/**
 * Rotas do contador de cafés.
 *   GET    /  -> { count }
 *   POST   /  -> { count }   body opcional: { "cups": 2 }
 *   DELETE /  -> { count: 0 }
 */
function createCoffeeRouter(service = createCoffeeService()) {
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.json({ count: service.getCount() });
  });

  router.post('/', (req, res) => {
    const cups = req.body && req.body.cups !== undefined ? req.body.cups : 1;
    try {
      res.status(201).json({ count: service.add(cups) });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/', (_req, res) => {
    res.json({ count: service.reset() });
  });

  return router;
}

module.exports = { createCoffeeRouter };
