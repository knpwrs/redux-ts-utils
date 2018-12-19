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
  expect(re(state, ac1())).toEqual({ counter: 1 });
  expect(re(state, ac2())).toEqual({ counter: 0 });
});

test('handles specific action with payload', () => {
  const ac1 = createAction<{ num: number }>('foo2');
  const ac2 = createAction<{ num: number }>('bar2');
  const state: { readonly counter: number } = { counter: 0 };
  const re = handleAction<typeof state>(ac1, (draft, { payload }) => {
    draft.counter += payload.num;
  }, state);
  expect(re(state, ac1({ num: 10 }))).toEqual({ counter: 10 });
  expect(re(state, ac2({ num: 10 }))).toEqual({ counter: 0 });
});
