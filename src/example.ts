/* eslint-disable no-param-reassign, no-console */
import * as assert from 'assert';
import { createStore, Store } from 'redux';
import { createAction, handleAction, reduceReducers } from '.';

// Actions

const increment = createAction('increment');
const decrement = createAction('decrement');
const add = createAction<number>('add');
const override = createAction<number>('override');

// Reducer

interface State {
  readonly counter: number;
}

const initialState: State = {
  counter: 0,
};

const reducer = reduceReducers<State>([
  handleAction(increment, (state) => {
    state.counter += 1;
  }),
  handleAction(decrement, (state) => {
    state.counter -= 1;
  }),
  handleAction(add, (state, { payload }) => {
    state.counter += payload;
  }),
  handleAction(override, (_, { payload }) => ({
    counter: payload,
  })),
], initialState);

// Store

const store: Store<State> = createStore(reducer);
store.subscribe(() => console.log('New state!', store.getState()));

// Go to town!

store.dispatch(increment());
store.dispatch(increment());
store.dispatch(increment());
store.dispatch(decrement());
// store.dispatch(decrement(1)); <-- TypeError: Expected 0 arguments, but got 1.

store.dispatch(add(10));
// store.dispatch(add()); <-- TypeError: Expected 1 arguments, but got 0.

console.log('Final count!', store.getState().counter);

assert(store.getState().counter === 12);
