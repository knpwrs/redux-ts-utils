import createAction from './create-action';
import handleAction from './handle-action';
import reduceReducers from './reduce-reducers';
import * as mod from '.';

test('module exports', () => {
  expect(mod).toEqual({
    createAction,
    handleAction,
    reduceReducers,
  });
});
