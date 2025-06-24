import { createDTO, CreateDTO } from './create.dto.js';
import { updateDTO, UpdateDTO } from './update.dto.js';

export class BrandRequestDTO {
  constructor() {}

  static create(data: CreateDTO): CreateDTO {
    return createDTO.parse(data);
  }

  static update(data: UpdateDTO): UpdateDTO {
    return updateDTO.parse(data);
  }
}
