import { compressingImageFromUrlDTO, CompressingImageFromUrlDTO } from './fromURL.dto.js';

export class TinyPNGCompressingImageRequestDTO {
  constructor() {}

  static fromURL(data: CompressingImageFromUrlDTO) {
    return compressingImageFromUrlDTO.parse(data);
  }
}
