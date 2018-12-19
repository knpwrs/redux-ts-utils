# redux-ts-utils

[![Dependency Status](https://img.shields.io/david/knpwrs/redux-ts-utils.svg)](https://david-dm.org/knpwrs/redux-ts-utils)
[![devDependency Status](https://img.shields.io/david/dev/knpwrs/redux-ts-utils.svg)](https://david-dm.org/knpwrs/redux-ts-utils#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/knpwrs/redux-ts-utils.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/knpwrs/redux-ts-utils.svg)](https://travis-ci.org/knpwrs/redux-ts-utils)
[![Npm Version](https://img.shields.io/npm/v/redux-ts-utils.svg)](https://www.npmjs.com/package/redux-ts-utils)
[![TypeScript 3](https://img.shields.io/badge/TypeScript-3-blue.svg)](http://shields.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Badges](https://img.shields.io/badge/badges-8-orange.svg)](http://shields.io/)

Everything you need to create type-safe applications with Redux! [Flux Standard
Action][FSA] compliant.

## Example Usage

```ts
import { createStore, Store } from 'redux';
import { createAction, handleAction, reduceReducers } from 'redux-ts-utils';

// Actions

const increment = createAction<void>('increment');
const decrement = createAction<void>('decrement');
const add = createAction<number>('add');

// Reducer

type State = {
  readonly counter: number,
};

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
  handleAction(add, (state, num) => {
    state.counter += num;
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
console.log('Final count!', store.getState().counter); // 12
```

Everything you see above is 100% type safe! The action creators only take
specified types and both the state and action payloads passed to the reducers
are strongly typed. Most types are inferred so you don't need to think about it
most of the time, but your build will still fail if you do something you
shouldn't.

The reducers are automatically run with [`immer`], which will track any
"mutations" you make and return the optimally-immutably-updated state object.

You can run the above example by cloning this repository and running the
following commands:

```sh
npm install
npm run example
```

## API

This package exports a grand total of three functions.

A lot of the generics for these functions can be inferred (see above example).
The typings below provided are optimized for readability.

### `createAction<T, A extends any[] = [T?]>(type: string, payloadCreator?(args: A) => T)`

The `createAction` returns an action creator function (a function which returns
an action object). The first argument should be a string representing the type
of action being created, and the second argument is an optional payload creator
function. The action objects returned by these action creators have two
properties: `type` (a `string`) and `payload` (typed as `T`).

Typically it is best to use the simplest signature for this function:

```ts
const myActionCreator = createAction<MyActionPayload>('MY_ACTION');
```

The action creator function will be typed to take whatever you provide as a
payload type.

If your action creator needs to take arguments other than whatever your payload
is typed as you can provide types in the generic signature:

```ts
// a, b, and c are inferred below:
const addThreeNumbers = createAction<number, [number, number, number]>('ADD_THREE_NUMBERS', (a, b, c) => a + b + c);
```

### `handleAction(actionCreator, (state: Draft<State>, payload) => void, initialState?: State)`

The `handleAction` function returns a single reducer function. The first
argument should be an action creator from the `createAction` function. The
second argument should be a "mutation" function which takes the current state
and the payload from the action. The third argument is an optional initial
state argument.

When provided with an action with a type that matches the type from
`actionCreator` the mutation function will be run. The mutation function is
automatically run with [`immer`] which will track all modifications you make to
the incoming state object and return the optimally-immutably-updated new state
object. [`immer`] will also provide you with a mapped type (`Draft`) of your
state with all `readonly` modifiers removed (it will also remove `Readonly`
mapped types and convert `ReadonlyArray`s to standard arrays).

### `reduceReducers<S>(reducers: Reducer[], initialState?: S)`

The `reduceReducers` function takes an array of reducer functions and an
optional initial state value and returns a single reducer which runs all of the
input reducers in sequence.

## Design Philosophy

### A Strong Emphasis on Type Safety

Nothing should be stringly-typed. If you make a breaking change anywhere in
your data layer the compiler should complain.

### Simplicity

Whenever possible it is best to maintain strong safety; however, this can lead
to extremely verbose code. For that reason this library strongly encourages
type inference whenever possible.

This library exports three functions and one type and everything you need is
provided by one package. The API surface is very small and easy to grok.

### Not Too Opinionated

`redux-ts-utils` provides TypeScript-friendly abstractions over the most
commonly-repeated pieces of boilerplate present in Redux projects. It is not a
complete framework abstracting all of Redux. It does not dictate or abstract
how you write your selectors, how you handle asynchronous actions or side
effects, how you create your store, or any other aspect of how you use Redux.
This makes `redux-ts-utils` very non-opinionated compared to other Redux
utility libraries. The closest thing to an opinion you will find in this
library is that it ships with [`immer`]. The reason for this is that [`immer`]
has proven to be the best method for dealing with immutable data structures in
a way which is both type-safe and performant. On top of that, [`immer`], by its
inclusion in [`redux-starter-kit`], has effectively been officially endorsed as
the de facto solution for managing immutable state changes. Shipping with
[`immer`] helps to maintain the goal of [simplicity](#simplicity) by reducing
the necessary API surface for writing reducers and by ensuring type inference
whenever possible.

Setting up a redux store and middleware is typically a one-time task per
project, so this library does not provide an abstraction for that. Likewise,
[thunks] are simple but [sagas] are powerful, or maybe you like [promises] or
[observables]. You should choose what works best for your project. Finally,
given this library's strong emphasis on type safety it doesn't necessarily make
sense to provide abstractions for creating selectors at the expense of type
safety.

### A Note on Flux Standard Actions

This library is compliant with [Flux Standard Actions][FSA]. That said, there
is one important distinction with the way this library is typed that you should
take note of of.

First, the [FSA] docs state that the `payload` property is optional and _may_
have a value. This makes reducers a pain to write because TypeScript will
enforce that you always check for the existence of the payload property in
order to use the resulting actions. If you want to create an action that
doesn't require a payload, the simplest (and most type-explicit) thing to do
is to type the payload as `void`:

```ts
const myAction = createAction<void>('MY_ACTION');
```

Even with this particular distinction, the actions created by this library are
[FSA]-compliant.

## Development Mode

In development mode (whenever `process.env.NODE_ENV` is not set to
`'production'`) the `createAction` function will throw an error if you create
two action creators with the same `type`.

## License

**MIT**

[FSA]: https://github.com/redux-utilities/flux-standard-action
[`immer`]: https://github.com/mweststrate/immer "Create the next immutable state by mutating the current one"
[`redux-starter-kit`]: https://www.npmjs.com/package/redux-starter-kit
[observables]: https://github.com/redux-observable/redux-observable
[promises]: https://github.com/redux-utilities/redux-promise
[sagas]: https://github.com/redux-saga/redux-saga
[thunks]: https://github.com/reduxjs/redux-thunk
