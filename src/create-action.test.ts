import { bindActionCreators } from 'redux';
import createAction from './create-action';

test('creates actions with constant payload creator', () => {
  const ac = createAction<string>('foo1', () => 'bar');
  expect(ac.type).toBe('foo1');
  expect(ac()).toEqual({
    type: 'foo1',
    payload: 'bar',
  });
});

test('creates actions with untyped identity payload creator', () => {
  const ac = createAction<string>('foo2');
  expect(ac.type).toBe('foo2');
  expect(ac('bar')).toEqual({
    type: 'foo2',
    payload: 'bar',
  });
});

test('creates actions with void identity payload creator', () => {
  const ac = createAction<void>('void-action');
  expect(ac.type).toBe('void-action');
  expect(ac()).toEqual({
    type: 'void-action',
  });
});

test('creates actions with void identity payload creator', () => {
  const ac = createAction('void-action-untyped');
  expect(ac.type).toBe('void-action-untyped');
  expect(ac()).toEqual({
    type: 'void-action-untyped',
  });
});

test('creates actions with explicit payload creator', () => {
  const ac = createAction<string, [number]>('foo3', num => `${num}`);
  expect(ac.type).toBe('foo3');
  expect(ac(4)).toEqual({
    type: 'foo3',
    payload: '4',
  });
});

test('creates actions with explicit payload creator (many args)', () => {
  const ac = createAction<string, [number, boolean, string]>('foo4', num => `${num * 2}`);
  expect(ac.type).toBe('foo4');
  expect(ac(4, true, 'bar')).toEqual({
    type: 'foo4',
    payload: '8',
  });
});

test('meta customizer', () => {
  const ac = createAction<string, [string], string>('with-meta', s => s, s => s.toUpperCase());
  expect(ac.type).toBe('with-meta');
  expect(ac('foo')).toEqual({
    type: 'with-meta',
    payload: 'foo',
    meta: 'FOO',
  });
});

test('generic inference', () => {
  const ac = createAction('generic-inference', (a: number, b: number, c: number) => a + b + c);
  expect(ac.type).toBe('generic-inference');
  expect(ac(1, 2, 3)).toEqual({
    type: 'generic-inference',
    payload: 6,
  });
});

test('generic inference with meta', () => {
  const ac = createAction<number, [number, number, number], string>(
    'generic-inference-with-meta',
    // Create `payload`
    (a, b, c) => a + b + c,
    // Create `meta`
    (a, b, c) => `${a} + ${b} + ${c}`,
  );
  expect(ac.type).toBe('generic-inference-with-meta');
  expect(ac(1, 2, 3)).toEqual({
    type: 'generic-inference-with-meta',
    payload: 6,
    meta: '1 + 2 + 3',
  });
});

test('error payload', () => {
  const ac = createAction<Error>('with-error');
  expect(ac.type).toBe('with-error');
  expect(ac(new Error('Rabble!'))).toEqual({
    type: 'with-error',
    payload: new Error('Rabble!'),
    error: true,
  });
});

test('polymorphic payload', () => {
  const ac = createAction<string | Error>('with-polymorphic');
  expect(ac.type).toBe('with-polymorphic');
  expect(ac('foo')).toEqual({
    type: 'with-polymorphic',
    payload: 'foo',
  });
  expect(ac(new Error('Rabble!'))).toEqual({
    type: 'with-polymorphic',
    payload: new Error('Rabble!'),
    error: true,
  });
});

test('works with bindActionCreators from redux', () => {
  const ac1 = createAction<string>('foo5', () => 'baz');
  expect(ac1.type).toBe('foo5');
  const ac2 = createAction<string, [string]>('bar5', s => s);
  expect(ac2.type).toBe('bar5');
  const acs = bindActionCreators({
    ac1,
    ac2,
  }, (action) => {
    expect(action.type).toBe('foo5');
    return action;
  });
  acs.ac1();
});

test('toString', () => {
  const ac = createAction('foo6');
  expect(ac.type).toBe('foo6');
  expect(ac.toString()).toBe('foo6');
});
