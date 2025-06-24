import { createDTO, CreateDTO } from './create.dto.js';
import { updateDTO, UpdateDTO } from './update.dto.js';
import { changeParentIdDTO, ChangeParentIdDTO } from './changeParentId.dto.js';
import { changeOrderDTO, ChangeOrderDTO } from './changeOrder.dto.js';

export class CategoryRequestDTO {
  constructor() {}

  static create(data: CreateDTO): CreateDTO {
    return createDTO.parse(data);
  }

  static update(data: UpdateDTO): UpdateDTO {
    return updateDTO.parse(data);
  }

  static changeParentId(data: ChangeParentIdDTO): ChangeParentIdDTO {
    return changeParentIdDTO.parse(data);
  }

  static changeOrder(data: ChangeOrderDTO): ChangeOrderDTO {
    return changeOrderDTO.parse(data);
  }
}
