import { CreateBrandRequestBodySchema, UpdateBrandRequestBodySchema } from '../schema/zod/api/requests/brand.schema.js';
import { IBrandDocument } from '../models/brand.model.js';
import { BrandRepository } from '../repositories/Brand.repository.js';
import { NotFoundError } from 'src/errors/NotFound.error.js';

type CreateParams = CreateBrandRequestBodySchema;
type DeleteParams = {
  brandId: string;
};
type UpdateParams = {
  brandId: string;
  updateData: UpdateBrandRequestBodySchema;
};

interface IBrandService {
  create: (params: CreateParams) => Promise<IBrandDocument>;
  delete: (params: DeleteParams) => Promise<void>;
  update: (params: UpdateParams) => Promise<IBrandDocument>;
}

export class BrandService implements IBrandService {
  private _brandRepository: BrandRepository = new BrandRepository();

  constructor() {}

  public async create(createData: CreateParams) {
    const brandData = await this._brandRepository.create(createData);
    return brandData;
  }

  public async delete({ brandId }: DeleteParams): Promise<void> {
    const data = await this._brandRepository.delete({ brandId });

    if (!data) {
      throw new NotFoundError({ message: 'Brand not found' });
    }
    return;
  }

  public async update({ brandId, updateData }: UpdateParams): Promise<IBrandDocument> {
    const brandUpdated = await this._brandRepository.update({ brandId, updateData });
    if (!brandUpdated) {
      throw new NotFoundError({ message: 'Brand not found' });
    }

    return brandUpdated;
  }
}
