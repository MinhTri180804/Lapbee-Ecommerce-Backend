import { Brand, IBrandDocument } from '../models/brand.model.js';
import { CreateBrandRequestBody, UpdateBrandRequestBody } from '../schema/zod/api/requests/brand.schema.js';

type CreateParams = CreateBrandRequestBody;
type DeleteParams = {
  brandId: string;
};
type UpdateParams = {
  brandId: string;
  updateData: UpdateBrandRequestBody;
};

type GetAllParams = {
  skip: number;
  limit: number;
};

type GetAllReturns = {
  paginatedResult: IBrandDocument[];
  totalCount: number;
};

interface IBrandRepository {
  create: (params: CreateParams) => Promise<IBrandDocument>;
  delete: (params: DeleteParams) => Promise<IBrandDocument | null>;
  update: (params: UpdateParams) => Promise<IBrandDocument | null>;
  getAll: (params: GetAllParams) => Promise<GetAllReturns>;
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

  public async getAll({ skip, limit }: GetAllParams): Promise<GetAllReturns> {
    const result = await this._brandMode
      .aggregate<{
        paginatedResults: IBrandDocument[];
        totalCount: { count: number }[];
      }>([
        {
          $facet: {
            paginatedResults: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: 'count' }]
          }
        }
      ])
      .exec();

    return {
      totalCount: result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0,
      paginatedResult: result[0].paginatedResults
    };
  }
}
