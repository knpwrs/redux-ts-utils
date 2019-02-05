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
