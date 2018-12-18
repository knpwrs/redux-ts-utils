/* eslint-disable no-param-reassign */

import createAction from './create-action';
import handleAction, { Draft } from './handle-action';
import reduceReducers from './reduce-reducers';

test('all together (type handle)', () => {
  const inc = createAction('inc1');
  const dec = createAction('dec1');
  const add = createAction<number>('add1');
  const state: { readonly counter: number } = { counter: 0 };
  const re = reduceReducers([
    handleAction<typeof state>(inc, (draft) => {
      draft.counter += 1;
    }),
    handleAction<typeof state>(dec, (draft) => {
      draft.counter -= 1;
    }),
    handleAction<typeof state>(add, (draft, num) => {
      draft.counter += num;
    }),
  ], state);
  const actions = [inc(), dec(), dec(), inc(), inc(), add(5)];
  expect(actions.reduce(re, undefined)).toEqual({ counter: 6 });
});

test('all together (type reducers)', () => {
  const inc = createAction('inc2');
  const dec = createAction('dec2');
  const add = createAction<number>('add2');
  const state: { readonly counter: number } = { counter: 0 };
  const re = reduceReducers([
    handleAction(inc, (draft: Draft<typeof state>) => {
      draft.counter += 1;
    }),
    handleAction(dec, (draft: Draft<typeof state>) => {
      draft.counter -= 1;
    }),
    handleAction(add, (draft: Draft<typeof state>, num) => {
      draft.counter += num;
    }),
  ], state);
  const actions = [inc(), dec(), dec(), inc(), inc(), add(5)];
  expect(actions.reduce(re, undefined)).toEqual({ counter: 6 });
});


test('all together (type reduceReducers)', () => {
  const inc = createAction('inc3');
  const dec = createAction('dec3');
  const add = createAction<number>('add3');
  const state: { readonly counter: number } = { counter: 0 };
  const re = reduceReducers<typeof state>([
    handleAction(inc, (draft) => {
      draft.counter += 1;
    }),
    handleAction(dec, (draft) => {
      draft.counter -= 1;
    }),
    handleAction(add, (draft, num) => {
      draft.counter += num;
    }),
  ], state);
  const actions = [inc(), dec(), dec(), inc(), inc(), add(5)];
  expect(actions.reduce(re, undefined)).toEqual({ counter: 6 });
});
