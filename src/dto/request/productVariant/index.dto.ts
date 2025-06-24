import { CreateDTO, createDTO } from './create.dto.js';
import { createManyDTO, CreateManyDTO } from './createMany.dto.js';

export class ProductVariantRequestDTO {
  constructor() {}

  static create(data: CreateDTO): CreateDTO {
    return createDTO.parse(data);
  }

  static createMany(data: CreateManyDTO): CreateManyDTO {
    return createManyDTO.parse(data);
  }
}
