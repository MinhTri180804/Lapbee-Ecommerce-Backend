interface IUtilsService {
  imageSizeFromUrl: (url: string) => Promise<{ size: number }>;
}

export class UtilsService implements IUtilsService {
  constructor() {}

  public imageSizeFromUrl = async (url: string) => {
    const response = await fetch(url);
    const size = response.headers.get('content-length');
    return { size: Number(size) };
  };
}
