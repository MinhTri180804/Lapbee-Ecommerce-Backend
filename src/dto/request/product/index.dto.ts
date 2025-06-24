import { createDTO, CreateDTO } from './create.dto.js';

export class ProductRequestDTO {
  constructor() {}

  static create(data: CreateDTO): CreateDTO {
    return createDTO.parse(data);
  }
}
