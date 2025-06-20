import { IProductVariantDocument } from '../models/productVariant.model.js';
import { ProductVariantRepository } from '../repositories/productVariant.repository.js';
import { CreateProductVariantRequestBody } from '../schema/zod/api/requests/productVariant.schema.js';
import { ProductRepository } from '../repositories/Product.repository.js';
import { BadRequestError } from '../errors/BadRequest.error.js';
import { validateObjectIds } from '../utils/validateObjectId.util.js';

type CreateParams = CreateProductVariantRequestBody & {
  productId: string;
};

interface IProductVariantService {
  create: (params: CreateParams) => Promise<IProductVariantDocument>;
}

export class ProductVariantService implements IProductVariantService {
  private _productVariantRepository: ProductVariantRepository = new ProductVariantRepository();
  private _productRepository: ProductRepository = new ProductRepository();

  constructor() {}

  public async create(createData: CreateParams): Promise<IProductVariantDocument> {
    const productIsExist = await this._productRepository.checkExist({ id: createData.productId });

    // Validation productId exist
    if (!productIsExist) {
      throw new BadRequestError({ message: 'ProductId is not exist' });
    }

    // Validation list related blog id exist
    if (createData.relatedBlogId.length > 0) {
      //TODO: Implement blog repository check relatedBlogId exist later
    }

    // Validation list related product variant id exist
    if (createData.relatedProductVariantId.length > 0) {
      const invalidObjectId = validateObjectIds(createData.relatedProductVariantId);
      if (invalidObjectId.length > 0) {
        throw new BadRequestError({
          message: `Related product variant id ${invalidObjectId.join('-')} invalid objectId`
        });
      }

      const existingIds = await this._productVariantRepository.findExistingIds({
        ids: createData.relatedProductVariantId
      });

      if (existingIds.length === 0) {
        throw new BadRequestError({
          message: `Related Product Variant Ids: ${createData.relatedProductVariantId.join('-')} is not existing`
        });
      }

      if (existingIds.length !== createData.relatedProductVariantId.length) {
        const invalidIds = createData.relatedProductVariantId.filter((id) => !existingIds.includes(id));
        throw new BadRequestError({ message: `Related Product variant Ids: ${invalidIds.join('-')} is not existing` });
      }
    }

    // Validation list suggest product variant id exist
    if (createData.suggestProductVariantId.length > 0) {
      const invalidObjectId = validateObjectIds(createData.suggestProductVariantId);
      if (invalidObjectId.length > 0) {
        throw new BadRequestError({
          message: `Suggest product variant id ${invalidObjectId.join('-')} invalid objectId`
        });
      }
      const existingIds = await this._productVariantRepository.findExistingIds({
        ids: createData.suggestProductVariantId
      });

      if (existingIds.length === 0) {
        throw new BadRequestError({
          message: `Suggest product variant ids: ${createData.suggestProductVariantId.join('-')} is not existing`
        });
      }

      if (existingIds.length !== createData.suggestProductVariantId.length) {
        const invalidIds = createData.suggestProductVariantId.filter((id) => !existingIds.includes(id));
        throw new BadRequestError({ message: `Suggest Product variant Ids: ${invalidIds.join('-')} is not existing` });
      }
    }

    const productVariant = await this._productVariantRepository.create(createData);
    return productVariant;
  }
}
