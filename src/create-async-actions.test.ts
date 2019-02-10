import createAsyncActions from './create-async-actions';

test('creates a triad of identity action creators', () => {
  const [start, success, fail] = createAsyncActions<string>('foo');
  expect(start.type).toBe('foo');
  expect(success.type).toBe('foo/SUCCESS');
  expect(fail.type).toBe('foo/ERROR');

  expect(start('foo')).toEqual({
    type: 'foo',
    payload: 'foo',
  });

  expect(success('foo')).toEqual({
    type: 'foo/SUCCESS',
    payload: 'foo',
  });

  const err = new Error('foo');
  expect(fail(err)).toEqual({
    type: 'foo/ERROR',
    payload: err,
    error: true,
  });
});

test('creates a triad of action creators with custom payloads', () => {
  const [start, success, fail] = createAsyncActions(
    'bar',
    (str: string) => str,
    (length: number) => length,
  );
  expect(start.type).toBe('bar');
  expect(success.type).toBe('bar/SUCCESS');
  expect(fail.type).toBe('bar/ERROR');

  expect(start('bar')).toEqual({
    type: 'bar',
    payload: 'bar',
  });

  expect(success(3)).toEqual({
    type: 'bar/SUCCESS',
    payload: 3,
  });

  const err = new Error('foo');
  expect(fail(err)).toEqual({
    type: 'bar/ERROR',
    payload: err,
    error: true,
  });
});

test('allows for mixed void and any', () => {
  const [start, success, fail] = createAsyncActions(
    'baz',
    () => {},
    (users: { name: string }[]) => users,
  );

  expect(start()).toEqual({
    type: 'baz',
  });
  expect(success([{ name: 'knpwrs' }])).toEqual({
    type: 'baz/SUCCESS',
    payload: [{ name: 'knpwrs' }],
  });
  const err = new Error('baz');
  expect(fail(err)).toEqual({
    type: 'baz/ERROR',
    payload: err,
    error: true,
  });
});
