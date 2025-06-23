import { getAllByProductDTO, GetAllByProductDTO } from './getAllByProduct.dto.js';
import { createManyDTO, CreateManyDTO } from './createMany.dto.js';
import { ProductVariantZodSchemaType } from 'src/schema/zod/productVariant/index.schema.js';
import { createDTO, CreateDTO } from './create.dto.js';
import { StatusProductVariantToName } from 'src/constants/statusProductVariantToName.constant.js';
import { StateProductToName } from 'src/constants/stateProduct.constant.js';
import { ICategoryDocument } from 'src/models/category.model.js';
import { IBrandDocument } from 'src/models/brand.model.js';
import { IProductDocument } from 'src/models/product.model.js';
import { getDetailsDTO, GetDetailsDTO } from './getDetail.dto.js';
import { IProductVariantDocument } from 'src/models/productVariant.model.js';

export class ProductVariantResponseDTO {
  constructor() {}

  static create(productVariant: ProductVariantZodSchemaType) {
    const candidate: CreateDTO = {
      id: String(productVariant._id),
      name: productVariant.name,
      slug: productVariant.slug,
      productId: String(productVariant.productId),
      sku: productVariant.sku,
      specs: productVariant.specs,
      seo: productVariant.seo,
      originPrice: productVariant.originPrice,
      salePrice: productVariant.salePrice,
      stock: productVariant.stock,
      sold: productVariant.sold,
      relatedBlogId: productVariant.relatedBlogId,
      relatedProductVariantId: productVariant.relatedProductVariantId,
      suggestProductVariantId: productVariant.suggestProductVariantId,
      status: {
        code: productVariant.status,
        name: StatusProductVariantToName[productVariant.status]
      },
      images: productVariant.images,
      categoryId: String(productVariant.categoryId),
      brandId: String(productVariant.brandId),
      state: {
        code: productVariant.state,
        name: StateProductToName[productVariant.state]
      },
      optionValues: productVariant.optionValues
    };

    return createDTO.parse(candidate);
  }

  static createMany(productVariants: ProductVariantZodSchemaType[]) {
    const candidate: CreateManyDTO = productVariants.map((productVariant) => ({
      id: String(productVariant._id),
      name: productVariant.name,
      slug: productVariant.slug,
      productId: String(productVariant.productId),
      sku: productVariant.sku,
      specs: productVariant.specs,
      seo: productVariant.seo,
      originPrice: productVariant.originPrice,
      salePrice: productVariant.salePrice,
      stock: productVariant.stock,
      sold: productVariant.sold,
      relatedBlogId: productVariant.relatedBlogId,
      relatedProductVariantId: productVariant.relatedProductVariantId,
      suggestProductVariantId: productVariant.suggestProductVariantId,
      status: {
        code: productVariant.status,
        name: StatusProductVariantToName[productVariant.status]
      },
      images: productVariant.images,
      categoryId: String(productVariant.categoryId),
      brandId: String(productVariant.brandId),
      state: {
        code: productVariant.state,
        name: StateProductToName[productVariant.state]
      },
      optionValues: productVariant.optionValues
    }));

    return createManyDTO.parse(candidate);
  }

  static getAllByProduct(
    productVariants: (ProductVariantZodSchemaType & {
      category: ICategoryDocument;
      brand: IBrandDocument;
    })[]
  ) {
    const candidate: GetAllByProductDTO = productVariants.map((productVariant) => ({
      id: String(productVariant._id),
      name: productVariant.name,
      slug: productVariant.slug,
      productId: String(productVariant.productId),
      sku: productVariant.sku,
      specs: productVariant.specs,
      seo: productVariant.seo,
      originPrice: productVariant.originPrice,
      salePrice: productVariant.salePrice,
      stock: productVariant.stock,
      sold: productVariant.sold,
      relatedBlogId: productVariant.relatedBlogId,
      relatedProductVariantId: productVariant.relatedProductVariantId,
      suggestProductVariantId: productVariant.suggestProductVariantId,
      status: {
        code: productVariant.status,
        name: StatusProductVariantToName[productVariant.status]
      },
      images: productVariant.images,
      category: productVariant.category
        ? {
            id: String(productVariant.category._id),
            name: productVariant.category.name,
            slug: productVariant.category.slug
          }
        : null,
      brand: productVariant.brand
        ? {
            id: String(productVariant.brand._id),
            name: productVariant.brand.name,
            logo: productVariant.brand.logo
          }
        : null,
      state: {
        code: productVariant.state,
        name: StateProductToName[productVariant.state]
      },
      optionValues: productVariant.optionValues
    }));

    return getAllByProductDTO.parse(candidate);
  }

  static getDetails(
    productVariant: IProductVariantDocument & {
      categoryId: ICategoryDocument | null;
      brandId: IBrandDocument | null;
      productId: IProductDocument;
    }
  ) {
    const productOrigin = productVariant.productId;
    const candidate: GetDetailsDTO = {
      productOrigin: {
        id: String(productOrigin._id),
        name: productOrigin.name,
        options: productOrigin.options,
        category: productVariant.categoryId
          ? {
              name: productVariant.categoryId.name,
              slug: productVariant.categoryId.slug,
              id: String(productVariant.categoryId._id)
            }
          : null,
        brand: productVariant.brandId
          ? {
              name: productVariant.brandId.name,
              logo: productVariant.brandId.logo,
              id: String(productVariant.brandId._id)
            }
          : null,
        commonImages: productOrigin.commonImages,
        commonSpecs: productOrigin.commonSpecs,
        state: {
          code: productOrigin.state,
          name: StateProductToName[productOrigin.state]
        },
        newInfo: getDetailsDTO.shape.productOrigin.shape.newInfo.parse(productOrigin.newInfo),
        usedInfo: getDetailsDTO.shape.productOrigin.shape.usedInfo.parse(productOrigin.usedInfo),
        description: productOrigin.description
      },
      productVariant: {
        id: String(productVariant._id),
        name: productVariant.name,
        slug: productVariant.slug,
        specs: productVariant.specs,
        sku: productVariant.sku,
        seo: productVariant.seo,
        originPrice: productVariant.originPrice,
        salePrice: productVariant.salePrice,
        stock: productVariant.stock,
        sold: productVariant.sold,
        relatedBlogId: productVariant.relatedBlogId,
        relatedProductVariantId: productVariant.relatedProductVariantId,
        suggestProductVariantId: productVariant.suggestProductVariantId,
        status: {
          code: productVariant.status,
          name: StatusProductVariantToName[productVariant.status]
        },
        images: productVariant.images,
        optionValues: productVariant.optionValues,
        description: productVariant.description
      }
    };

    return getDetailsDTO.parse(candidate);
  }
}
