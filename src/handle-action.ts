import { Reducer } from 'redux';
import {
  Draft,
  createDraft,
  finishDraft,
} from 'immer';
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
  return (state: S | undefined, action: ReturnType<AC>) => {
    if (action.type === ac.type && state) {
      const draft = createDraft(state);
      re(draft, action);
      return finishDraft(draft);
    }
    return (state || s) as any;
  };
}
