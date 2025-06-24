import { IBrandDocument } from '../../../models/brand.model.js';
import { createDTO, CreateDTO } from './create.dto.js';
import { updateDTO, UpdateDTO } from './update.dto.js';
import { getDetailsDTO, GetDetailsDTO } from './getDetails.dto.js';
import { getAllDTO, GetAllDTO } from './getAll.dto.js';

export class BrandResponseDTO {
  constructor() {}

  static create(brand: IBrandDocument) {
    const candidate: CreateDTO = {
      id: String(brand._id),
      name: brand.name,
      slug: brand.slug,
      banners: brand.banners,
      logo: brand.logo,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString()
    };

    return createDTO.parse(candidate);
  }

  static update(brand: IBrandDocument) {
    const candidate: UpdateDTO = {
      id: String(brand._id),
      name: brand.name,
      slug: brand.slug,
      banners: brand.banners,
      logo: brand.logo,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString()
    };

    return updateDTO.parse(candidate);
  }

  static getDetail(brand: IBrandDocument) {
    const candidate: GetDetailsDTO = {
      id: String(brand._id),
      name: brand.name,
      slug: brand.slug,
      banners: brand.banners,
      logo: brand.logo,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString()
    };

    return getDetailsDTO.parse(candidate);
  }

  static getAll(brands: IBrandDocument[]) {
    const candidate: GetAllDTO = brands.map((brand) => ({
      id: String(brand._id),
      name: brand.name,
      slug: brand.slug,
      banners: brand.banners,
      logo: brand.logo,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString()
    }));

    return getAllDTO.parse(candidate);
  }
}
