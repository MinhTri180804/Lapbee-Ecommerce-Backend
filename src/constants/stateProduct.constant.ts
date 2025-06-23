import { StateProductEnum } from './../enums/stateProduct.enum.js';
type StateProductToName = {
  [key in StateProductEnum]: string;
};

export const StateProductToName: StateProductToName = {
  0: 'Sản phẩm mới',
  1: 'Sản phẩm đã qua sử dụng'
};

export type StateProductToNameKeys = keyof typeof StateProductToName;
export type StateProductToNameValues = (typeof StateProductToName)[StateProductToNameKeys];
