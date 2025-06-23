import { IProductDocument } from '../../../models/product.model.js';
import { StateProductToName } from './../../../constants/stateProduct.constant.js';
import { createDTO, CreateDTO } from './create.dto.js';

export class ProductResponseDTO {
  constructor() {}

  static create(product: IProductDocument) {
    const candidate: CreateDTO = {
      name: product.name,
      id: String(product._id),
      categoryId: String(product.categoryId),
      brandId: String(product.brandId),
      commonImages: product.commonImages,
      commonSpecs: product.commonSpecs,
      state: {
        code: product.state,
        name: StateProductToName[product.state]
      },
      newInfo: product.newInfo,
      usedInfo: product.usedInfo,
      options: product.options,
      description: product.description
    };

    return createDTO.parse(candidate);
  }
}
