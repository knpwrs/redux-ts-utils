import { bindActionCreators } from 'redux';
import createAction from './create-action';

test('creates actions with constant payload creator', () => {
  const ac = createAction<string>('foo', () => 'bar');
  expect(ac()).toEqual({
    type: 'foo',
    payload: 'bar',
  });
});

test('creates actions with untyped identity payload creator', () => {
  const ac = createAction<string>('foo');
  expect(ac('bar')).toEqual({
    type: 'foo',
    payload: 'bar',
  });
});

test('creates actions with explicit payload creator', () => {
  const ac = createAction<string, [number]>('foo', num => `${num}`);
  expect(ac(4)).toEqual({
    type: 'foo',
    payload: '4',
  });
});

test('creates actions with explicit payload creator (many args)', () => {
  const ac = createAction<string, [number, boolean, string]>('foo', num => `${num * 2}`);
  expect(ac(4, true, 'bar')).toEqual({
    type: 'foo',
    payload: '8',
  });
});

test('works with bindActionCreators from redux', () => {
  const ac1 = createAction<string>('foo', () => 'baz');
  const ac2 = createAction<string, [string]>('bar', s => s);
  const acs = bindActionCreators({
    ac1,
    ac2,
  }, (action) => {
    expect(action.type).toBe('foo');
    return action;
  });
  acs.ac1();
});

test('toString', () => {
  expect(createAction('foo').toString()).toBe('foo');
});
