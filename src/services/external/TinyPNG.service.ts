import { TinyPNGShrinkImageResponse } from './../../types/tinyPNG.type.js';
import { env } from '../../configs/env.config.js';
import { MaxSizeFileError } from '../../errors/MaxSizeFile.error.js';

type CompressingImageFromURLParams = {
  url: string;
};

type CompressingIMageFromLocalParams = {
  file: Express.Multer.File;
};

interface ITinyPNGService {
  compressingImageFromURL: (params: CompressingImageFromURLParams) => Promise<TinyPNGShrinkImageResponse>;
  compressingImageFromLocal: (params: CompressingIMageFromLocalParams) => Promise<TinyPNGShrinkImageResponse>;
}

export class TinyPNGService implements ITinyPNGService {
  private readonly urlApi = 'https://api.tinify.com';

  constructor() {}

  public async compressingImageFromURL({ url }: CompressingImageFromURLParams): Promise<TinyPNGShrinkImageResponse> {
    const response = await fetch(`${this.urlApi}/shrink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${env.tinyPNG.API_KEY}`
      },
      body: JSON.stringify({
        source: {
          url
        }
      })
    });

    const data = await response.json();
    return data;
  }

  public async compressingImageFromLocal({
    file
  }: CompressingIMageFromLocalParams): Promise<TinyPNGShrinkImageResponse> {
    if (file.size > Number(env.tinyPNG.MAX_SIZE_FILE)) {
      throw new MaxSizeFileError({ message: 'File size is too large' });
    }

    const response = await fetch(`${this.urlApi}/shrink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${env.tinyPNG.API_KEY}`
      },
      body: file.buffer
    });

    const data = await response.json();
    return data;
  }
}
