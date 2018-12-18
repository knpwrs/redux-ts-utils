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

// eslint-disable-next-line arrow-parens
export default <P, A extends any[] = [P?]>(
  type: string,
  pc: PayloadCreator<P, A> = identity,
): TsActionCreator<P, A> => {
  const ac = (...args: any[]): TsAction<P> => ({
    type,
    payload: pc(...args as A),
  });
  ac.toString = () => type;
  return ac;
};
