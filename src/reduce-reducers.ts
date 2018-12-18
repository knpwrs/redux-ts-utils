import { Reducer } from 'redux';

export default <S>(res: Reducer<S, any>[], initialState?: S): Reducer<S, any> => (
  (state = initialState as S, action) => (
    res.reduce(
      (curr, re) => re(curr, action),
      state,
    )
  )
);
