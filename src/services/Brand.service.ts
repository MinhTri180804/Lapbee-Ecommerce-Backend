import { CreateBrandRequestBodySchema } from '../schema/zod/api/requests/brand.schema.js';
import { IBrandDocument } from '../models/brand.model.js';
import { BrandRepository } from '../repositories/Brand.repository.js';

type CreateParams = CreateBrandRequestBodySchema;

interface IBrandService {
  create: (params: CreateParams) => Promise<IBrandDocument>;
}

export class BrandService implements IBrandService {
  private _brandRepository: BrandRepository = new BrandRepository();

  constructor() {}

  public async create(createData: CreateParams) {
    const brandData = await this._brandRepository.create(createData);
    return brandData;
  }
}
