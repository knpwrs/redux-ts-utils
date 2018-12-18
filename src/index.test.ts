import createAction from './create-action';
import * as mod from '.';

test('module exports', () => {
  expect(mod).toEqual({
    createAction,
  });
});
