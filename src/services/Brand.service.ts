import { IBrandDocument } from '../models/brand.model.js';
import { BrandRepository } from '../repositories/Brand.repository.js';
import { NotFoundError } from 'src/errors/NotFound.error.js';
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
  page: number;
  limit: number;
};

type GetAllReturns = {
  paginatedResult: IBrandDocument[];
  metadata: {
    totalDocument: number;
    totalPage: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    limit: number;
  };
};
type GetDetailsParams = {
  brandId: string;
};

interface IBrandService {
  create: (params: CreateParams) => Promise<IBrandDocument>;
  delete: (params: DeleteParams) => Promise<void>;
  update: (params: UpdateParams) => Promise<IBrandDocument>;
  getAll: (params: GetAllParams) => Promise<GetAllReturns>;
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

  public async getDetails({ brandId }: GetDetailsParams): Promise<IBrandDocument> {
    const brand = await this._brandRepository.getById({ id: brandId });
    if (!brand) {
      throw new NotFoundError({ message: 'Brand not found' });
    }

    return brand;
  }

  public async getAll({ page, limit }: GetAllParams): Promise<GetAllReturns> {
    const skip = (page - 1) * limit;
    const { paginatedResult, totalCount } = await this._brandRepository.getAll({
      skip,
      limit
    });
    console.log(skip);

    const totalPage = Math.ceil(totalCount / limit);
    const currentPage = page;
    const nextPage = currentPage < totalPage ? page + 1 : null;
    const previousPage = page - 1 > 0 ? page - 1 : null;
    const totalDocument = paginatedResult.length;

    return {
      paginatedResult,
      metadata: {
        totalDocument,
        totalPage,
        currentPage,
        nextPage,
        previousPage,
        limit
      }
    };
  }
}
