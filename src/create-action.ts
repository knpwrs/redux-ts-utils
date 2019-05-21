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
interface TsIdentityPayloadActionCreator<P> {
  (payload: P): TsAction<P, void>;
  type: string;
}
interface TsVoidActionCreator {
  (): TsAction<void, void>;
  type: string;
}

export type PayloadCreator<P, A extends any[] = [P?]> = (...args: A) => P;
export const identity = <T extends any[]>(...arg: T): T[0] => arg[0];


function createAction(type: string): TsVoidActionCreator;
function createAction<P>(type: string): TsIdentityPayloadActionCreator<P>;
function createAction<P, A extends any[] = [P?], M = void>(
  type: string,
  pc: PayloadCreator<P, A>,
  mc?: PayloadCreator<M, A>,
): TsActionCreator<P, A, M>;

function createAction <P, A extends any[] = [P?], M = void>(
  type: string,
  pc: PayloadCreator<P, A> = identity,
  mc?: PayloadCreator<M, A>,
): TsVoidActionCreator | TsIdentityPayloadActionCreator<P> | TsActionCreator<P, A, M> {
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
}

export default createAction;
