import { Action } from 'redux';

export interface TsAction<T> extends Action<string> {
  payload: T;
  toString(): string;
}

export interface TsActionCreator<T, A extends any[] = [T?]> {
  (...args: A): TsAction<T>;
}

export type PayloadCreator<P, A extends any[] = [P?]> = (...args: A) => P;
const identity = <T extends any[]>(...arg: T): T[0] => arg[0];

// As long as we're in development mode we will store already-created action
// types for debug purposes.
let debugTypeMap: { [key: string]: true };
if (process.env.NODE_ENV !== 'production') {
  debugTypeMap = {};
}

// eslint-disable-next-line arrow-parens
export default <P, A extends any[] = [P?]>(
  type: string,
  pc: PayloadCreator<P, A> = identity,
): TsActionCreator<P, A> => {
  // Make sure to avoid action type collisions. This code is removed in
  // production.
  if (process.env.NODE_ENV !== 'production') {
    if (debugTypeMap && debugTypeMap[type]) {
      throw new Error(`DUPLICATE ACTION CREATOR! type: ${type}`);
    }
    debugTypeMap[type] = true;
  }
  // Continue with creating an action creator
  const ac = (...args: any[]): TsAction<P> => ({
    type,
    payload: pc(...args as A),
  });
  ac.toString = () => type;
  return ac;
};
