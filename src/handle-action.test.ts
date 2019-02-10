/* eslint-disable no-param-reassign */

import handleAction from './handle-action';
import createAction from './create-action';

test('handles specific action', () => {
  const ac1 = createAction('foo1');
  const ac2 = createAction('bar1');
  const state: { readonly counter: number } = { counter: 0 };
  const re = handleAction<typeof state>(ac1, (draft) => {
    draft.counter += 1;
  }, state);
  const newState1 = re(state, ac1());
  expect(newState1).toEqual({ counter: 1 });
  expect(newState1).not.toBe(state);
  const newState2 = re(state, ac2());
  expect(newState2).toEqual({ counter: 0 });
  expect(newState2).toBe(state);
});

test('handles specific action with payload', () => {
  const ac1 = createAction<{ num: number }>('foo2');
  const ac2 = createAction<{ num: number }>('bar2');
  const state: { readonly counter: number } = { counter: 0 };
  const re = handleAction<typeof state>(ac1, (draft, { payload }) => {
    draft.counter += payload.num;
  }, state);
  const newState1 = re(state, ac1({ num: 10 }));
  expect(newState1).toEqual({ counter: 10 });
  expect(newState1).not.toBe(state);
  const newState2 = re(state, ac2({ num: 10 }));
  expect(newState2).toEqual({ counter: 0 });
  expect(newState2).toBe(state);
});

test('handles specific action with payload by returning value directly', () => {
  const ac1 = createAction<{ num: number }>('foo3');
  const state: { readonly counter: number } = { counter: 0 };
  const re = handleAction<typeof state>(ac1, (draft, { payload }) => ({
    counter: draft.counter + payload.num,
  }), state);
  const newState1 = re(state, ac1({ num: 7 }));
  expect(newState1).toEqual({ counter: 7 });
  expect(newState1).not.toBe(state);
});

test('handles specific action with payload and ignores directly returned value if draft is mutated', () => {
  const ac1 = createAction<{ num: number }>('foo4');
  const state: { readonly counter: number } = { counter: 0 };
  const re = handleAction<typeof state>(ac1, (draft, { payload }) => {
    draft.counter += payload.num;
    return 'unintended return value';
  }, state);
  const newState1 = re(state, ac1({ num: 10 }));
  expect(newState1).toEqual({ counter: 10 });
  expect(newState1).not.toBe(state);
});

test('handles specific action and uses previous state if directly return value is undefined', () => {
  const ac1 = createAction<void>('foo5');
  const state: { readonly baz: number } = { baz: 0 };
  const re = handleAction<typeof state>(ac1, () => undefined, state);
  const newState1 = re(state, ac1());
  expect(newState1).toEqual({ baz: 0 });
  expect(newState1).toBe(state);
});

test('supports default state', () => {
  const ac1 = createAction<void>('foo6');
  const state: { readonly baz: number } = { baz: 0 };
  const re = handleAction<typeof state>(ac1, () => undefined, state);
  const newState1 = re(undefined, { type: '@@redux/INIT' });
  expect(newState1).toEqual({ baz: 0 });
  expect(newState1).toBe(state);
});
