import { Reducer } from 'redux';
import { Draft, produce } from 'immer';
import {
  // eslint-disable-next-line no-unused-vars
  TsActionCreator,
  // eslint-disable-next-line no-unused-vars
  TsAction,
} from './create-action';

export { Draft } from 'immer';

export type TsReducer<S, A extends TsAction<any>> = (s: Draft<S>, p: A) => void;

export default function handleAction<S, AC extends TsActionCreator<any> = any>(
  ac: AC,
  re: TsReducer<S, ReturnType<AC>>,
  s?: S,
): Reducer<S, ReturnType<AC>> {
  return produce<S, Draft<S>, [ReturnType<AC>]>((draft, action) => {
    if (action.type === ac.type) {
      re(draft, action);
    }
  }, s as S) as any; // see https://github.com/mweststrate/immer/issues/289
}
