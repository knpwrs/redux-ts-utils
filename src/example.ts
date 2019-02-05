/* eslint-disable no-param-reassign, no-console */
import * as assert from 'assert';
import { createStore, Store } from 'redux';
import { createAction, handleAction, reduceReducers } from '.';

// Actions

const increment = createAction<void>('increment');
const decrement = createAction<void>('decrement');
const add = createAction<number>('add');

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
], initialState);

// Store

const store: Store<State> = createStore(reducer);
store.subscribe(() => console.log('New state!', store.getState()));

// Go to town!

store.dispatch(increment());
store.dispatch(increment());
store.dispatch(increment());
store.dispatch(decrement());
store.dispatch(add(10));
console.log('Final count!', store.getState().counter);

assert(store.getState().counter === 12);
