import { Brand, IBrandDocument } from '../models/brand.model.js';
import { CreateBrandRequestBodySchema, UpdateBrandRequestBodySchema } from '../schema/zod/api/requests/brand.schema.js';

type CreateParams = CreateBrandRequestBodySchema;
type DeleteParams = {
  brandId: string;
};
type UpdateParams = {
  brandId: string;
  updateData: UpdateBrandRequestBodySchema;
};

interface IBrandRepository {
  create: (params: CreateParams) => Promise<IBrandDocument>;
  delete: (params: DeleteParams) => Promise<IBrandDocument | null>;
  update: (params: UpdateParams) => Promise<IBrandDocument | null>;
}

export class BrandRepository implements IBrandRepository {
  private _brandMode: typeof Brand = Brand;
  constructor() {}

  public async create(createData: CreateParams): Promise<IBrandDocument> {
    const data = await this._brandMode.create(createData);
    return data;
  }

  public async delete({ brandId }: DeleteParams): Promise<IBrandDocument | null> {
    return await this._brandMode.findByIdAndDelete(brandId);
  }

  public async update({ brandId, updateData }: UpdateParams): Promise<IBrandDocument | null> {
    return await this._brandMode.findOneAndUpdate(
      {
        _id: brandId
      },
      updateData,
      { new: true }
    );
  }
}
