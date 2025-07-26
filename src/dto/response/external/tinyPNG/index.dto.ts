import { compressingImageFromUrlDTO, CompressingImageFromUrlDTO } from './fromURL.dto.js';
import { TinyPNGShrinkImageResponse } from '../../../../types/tinyPNG.type.js';

export class TinyPNGCompressingImageResponseDTO {
  constructor() {}

  static fromURL(data: TinyPNGShrinkImageResponse) {
    const candidate: CompressingImageFromUrlDTO = {
      input: {
        size: data.input.size,
        type: data.input.type
      },
      output: {
        size: data.output.size,
        type: data.output.type,
        ratio: data.output.ratio,
        url: data.output.url
      }
    };
    return compressingImageFromUrlDTO.parse(candidate);
  }
}
