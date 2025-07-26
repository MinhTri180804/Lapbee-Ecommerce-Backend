import { sendSuccessResponse } from '../../../utils/responses.util.js';
import { TinyPNGService } from '../../../services/external/TinyPNG.service.js';
import { Request, Response } from 'express';
import { CompressingImageFromUrlDTO } from '../../../dto/request/external/tinyPNG/compressingImage/fromURL.dto.js';
import { TinyPNGCompressingImageRequestDTO } from '../../../dto/request/external/tinyPNG/compressingImage/index.dto.js';
import { StatusCodes } from 'http-status-codes';
import { TinyPNGCompressingImageResponseDTO } from '../../../dto/response/external/tinyPNG/index.dto.js';

type FromURLRequestType = Request<unknown, unknown, CompressingImageFromUrlDTO>;
type FromLocalImageRequestType = Request;

interface ICompressingImageTinyPNGController {
  fromURL: (request: FromURLRequestType, response: Response) => Promise<void>;
  fromLocalImage: (request: FromLocalImageRequestType, response: Response) => Promise<void>;
}

export class CompressingImageTinyPNGController implements ICompressingImageTinyPNGController {
  private readonly tinyPNGService: TinyPNGService = new TinyPNGService();

  constructor() {}

  public async fromURL(request: FromURLRequestType, response: Response): Promise<void> {
    const { url } = TinyPNGCompressingImageRequestDTO.fromURL(request.body);
    const data = await this.tinyPNGService.compressingImageFromURL({ url });

    const result = TinyPNGCompressingImageResponseDTO.fromURL(data);

    sendSuccessResponse<typeof result>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Compressing image from URL success',
        data: result
      }
    });
  }

  public async fromLocalImage(request: FromLocalImageRequestType, response: Response): Promise<void> {
    const file = request.file as Express.Multer.File;

    const data = await this.tinyPNGService.compressingImageFromLocal({ file });

    sendSuccessResponse<typeof data>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Compressing image from local success',
        data
      }
    });
  }
}
