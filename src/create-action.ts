import { Action } from 'redux';

export interface TsAction<P = void, M = void> extends Action<string> {
  payload: P;
  error?: boolean;
  meta?: M;
  toString(): string;
}

export interface TsActionCreator<P = void, A extends any[] = [P], M = void> {
  (...args: A): TsAction<P, M>;
  type: string;
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
export default <P, A extends any[] = [P?], M = void>(
  type: string,
  pc: PayloadCreator<P, A> = identity,
  mc?: PayloadCreator<M, A>,
): TsActionCreator<P, A, M> => {
  // Make sure to avoid action type collisions. This code is removed in
  // production.
  if (process.env.NODE_ENV !== 'production') {
    if (debugTypeMap && debugTypeMap[type]) {
      throw new Error(`DUPLICATE ACTION CREATOR! type: ${type}`);
    }
    debugTypeMap[type] = true;
  }

  // Continue with creating an action creator
  const ac = (...args: A): TsAction<P, M> => {
    const payload = pc(...args);

    const action: TsAction<P, M> = { type, payload };

    if (payload instanceof Error) {
      action.error = true;
    }

    if (mc) {
      action.meta = mc(...args);
    }

    return action;
  };

  (ac as TsActionCreator<P, A, M>).type = type;
  ac.toString = () => type;

  return ac as TsActionCreator<P, A, M>;
};
