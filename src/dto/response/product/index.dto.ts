import { IProductDocument } from '../../../models/product.model.js';
import { StateProductToName } from './../../../constants/stateProduct.constant.js';
import { createDTO, CreateDTO } from './create.dto.js';

export class ProductResponseDTO {
  constructor() {}

  static create(product: IProductDocument) {
    const candidate: CreateDTO = {
      id: String(product._id),
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId ? String(product.categoryId) : null,
      brandId: product.brandId ? String(product.brandId) : null,
      commonImages: product.commonImages,
      commonSpecs: product.commonSpecs,
      state: {
        code: product.state,
        name: StateProductToName[product.state]
      },
      newInfo: product.newInfo,
      usedInfo: product.usedInfo,
      options: product.options,
      description: product.description,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    };

    return createDTO.parse(candidate);
  }
}
