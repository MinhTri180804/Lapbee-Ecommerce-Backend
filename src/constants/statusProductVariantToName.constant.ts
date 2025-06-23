import { StatusProductVariantEnum } from '../enums/statusProductVariant.enum.js';

type StatusProductVariantToName = {
  [key in StatusProductVariantEnum]: string;
};

export const StatusProductVariantToName: StatusProductVariantToName = {
  0: 'Đang hiển thị và có thể mua',
  1: 'Không hiển thị, tạm ẩn khỏi frontend',
  2: 'Hết hàng tạm thời',
  3: 'Ngừng bán hoàn toàn',
  4: 'Đang soạn thảo, chưa được công khai'
};

export type StatusProductVariantKeys = keyof typeof StatusProductVariantToName;
export type StatusProductVariantValues = (typeof StatusProductVariantToName)[StatusProductVariantKeys];
