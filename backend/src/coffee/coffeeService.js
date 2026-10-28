'use strict';

/**
 * Serviço do contador de cafés (em memória, de propósito simples).
 * Cada chamada a createCoffeeService() cria um contador isolado,
 * o que facilita os testes unitários.
 */
function createCoffeeService(initialCount = 0) {
  if (!Number.isInteger(initialCount) || initialCount < 0) {
    throw new RangeError('initialCount deve ser um inteiro >= 0');
  }

  let count = initialCount;

  return {
    getCount() {
      return count;
    },

    add(cups = 1) {
      if (!Number.isInteger(cups) || cups < 1) {
        throw new RangeError('cups deve ser um inteiro >= 1');
      }
      count += cups;
      return count;
    },

    reset() {
      count = 0;
      return count;
    },
  };
}

module.exports = { createCoffeeService };
