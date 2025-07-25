import { TinyPNGShrinkImageResponse } from './../../types/tinyPNG.type.js';
import { env } from '../../configs/env.config.js';
type CompressingImageFromURLParams = {
  url: string;
};

interface ITinyPNGService {
  compressingImageFromURL: (params: CompressingImageFromURLParams) => Promise<TinyPNGShrinkImageResponse>;
}

export class TinyPNGService implements ITinyPNGService {
  constructor() {}

  public async compressingImageFromURL({ url }: CompressingImageFromURLParams): Promise<TinyPNGShrinkImageResponse> {
    const response = await fetch('https://api.tinify.com/shrink', {
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
}
