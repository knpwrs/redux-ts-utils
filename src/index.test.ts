import createAction from './create-action';
import createAsyncActions from './create-async-actions';
import handleAction from './handle-action';
import reduceReducers from './reduce-reducers';
import * as mod from '.';

test('module exports', () => {
  expect(mod).toEqual({
    createAction,
    createAsyncActions,
    handleAction,
    reduceReducers,
  });
});
