import createAction, { PayloadCreator, TsActionCreator, identity } from './create-action';

export default <
  PStart,
  AStart extends any[] = [PStart],
  PSuc = PStart,
  ASuc extends any[] = AStart,
  PErr = Error,
  AErr extends any[] = [PErr]
>(
  name: string,
  startPc: PayloadCreator<PStart, AStart> = identity,
  sucPc: PayloadCreator<PSuc, ASuc> = identity,
  errPc: PayloadCreator<PErr, AErr> = identity,
): [
  TsActionCreator<PStart, AStart>,
  TsActionCreator<PSuc, ASuc>,
  TsActionCreator<PErr, AErr>,
] => [
  createAction<PStart, AStart>(name, startPc),
  createAction<PSuc, ASuc>(`${name}/SUCCESS`, sucPc),
  createAction<PErr, AErr>(`${name}/ERROR`, errPc),
];
