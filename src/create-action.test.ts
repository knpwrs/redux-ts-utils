import { bindActionCreators } from 'redux';
import createAction from './create-action';

test('creates actions with constant payload creator', () => {
  const ac = createAction<string>('foo1', () => 'bar');
  expect(ac()).toEqual({
    type: 'foo1',
    payload: 'bar',
  });
});

test('creates actions with untyped identity payload creator', () => {
  const ac = createAction<string>('foo2');
  expect(ac('bar')).toEqual({
    type: 'foo2',
    payload: 'bar',
  });
});

test('creates actions with explicit payload creator', () => {
  const ac = createAction<string, [number]>('foo3', num => `${num}`);
  expect(ac(4)).toEqual({
    type: 'foo3',
    payload: '4',
  });
});

test('creates actions with explicit payload creator (many args)', () => {
  const ac = createAction<string, [number, boolean, string]>('foo4', num => `${num * 2}`);
  expect(ac(4, true, 'bar')).toEqual({
    type: 'foo4',
    payload: '8',
  });
});

test('works with bindActionCreators from redux', () => {
  const ac1 = createAction<string>('foo5', () => 'baz');
  const ac2 = createAction<string, [string]>('bar5', s => s);
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
  expect(createAction('foo6').toString()).toBe('foo6');
});

const setNodeEnv = (env: string) => {
  const old = process.env.NODE_ENV;
  process.env.NODE_ENV = env;
  return () => {
    process.env.NODE_ENV = old;
  };
};

test('does not allow colliding action types in development', () => {
  // Development
  expect(() => {
    const reset = setNodeEnv('development');
    createAction<string>('banana');
    createAction<string>('banana');
    reset();
  }).toThrowError(/DUPLICATE/);

  // Production
  expect(() => {
    const reset = setNodeEnv('production');
    createAction<string>('banana');
    createAction<string>('banana');
    reset();
  }).not.toThrowError(/DUPLICATE/);
});
