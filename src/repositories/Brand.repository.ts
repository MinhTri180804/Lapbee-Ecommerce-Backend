import { Brand, IBrandDocument } from '../models/brand.model.js';
import { CreateDTO as BrandCreateRequestDTO } from '../dto/request/brand/create.dto.js';
import { UpdateDTO as BrandUpdateRequestDTO } from '../dto/request/brand/update.dto.js';

type CreateParams = BrandCreateRequestDTO;
type DeleteParams = {
  brandId: string;
};
type UpdateParams = {
  brandId: string;
  updateData: BrandUpdateRequestDTO;
};

type GetAllParams = {
  skip: number;
  limit: number;
};

type GetAllReturns = {
  paginatedResult: IBrandDocument[];
  totalCount: number;
};
type GetByIdParams = {
  id: string;
};
type CheckExistParams = {
  id: string;
};

interface IBrandRepository {
  create: (params: CreateParams) => Promise<IBrandDocument>;
  delete: (params: DeleteParams) => Promise<IBrandDocument | null>;
  update: (params: UpdateParams) => Promise<IBrandDocument | null>;
  getAll: (params: GetAllParams) => Promise<GetAllReturns>;
  getById: (params: GetByIdParams) => Promise<IBrandDocument | null>;
  checkExist: (params: CheckExistParams) => Promise<boolean>;
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

  public async getById({ id }: GetByIdParams): Promise<IBrandDocument | null> {
    return await this._brandMode.findById(id);
  }

  public async checkExist({ id }: CheckExistParams): Promise<boolean> {
    const brand = await this._brandMode.exists({ _id: id });
    if (!brand) return false;

    return true;
  }
}
