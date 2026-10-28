const { createCoffeeService } = require('../../src/coffee/coffeeService');

describe('coffeeService (unitário)', () => {
  test('começa em zero', () => {
    expect(createCoffeeService().getCount()).toBe(0);
  });

  test('add() soma 1 por padrão', () => {
    const s = createCoffeeService();
    expect(s.add()).toBe(1);
    expect(s.add()).toBe(2);
  });

  test('add(n) soma n cafés', () => {
    const s = createCoffeeService();
    expect(s.add(3)).toBe(3);
  });

  test.each([0, -1, 1.5, 'a', null])('add(%p) é rejeitado', (v) => {
    expect(() => createCoffeeService().add(v)).toThrow(RangeError);
  });

  test('reset() zera o contador', () => {
    const s = createCoffeeService(5);
    expect(s.reset()).toBe(0);
    expect(s.getCount()).toBe(0);
  });

  test('initialCount inválido é rejeitado', () => {
    expect(() => createCoffeeService(-1)).toThrow(RangeError);
  });

  test('contadores são independentes', () => {
    const a = createCoffeeService();
    const b = createCoffeeService();
    a.add();
    expect(b.getCount()).toBe(0);
  });
});
