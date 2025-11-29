import { PipelineStage, Model } from "mongoose";
import { ICategories } from "../models/categories";
import { PaginationMeta } from "../utils/apiResponse";
import { PaginationUtil } from "../utils/pagination";
import { SortUtil } from "../utils/sort";
import { ApiError } from "../utils/apiError";
import {
  QueryCategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dtos/categories.dto";

export class CategoriesService {
  private CategoriesModel: Model<ICategories>;

  constructor(CategoriesModel: Model<ICategories>) {
    this.CategoriesModel = CategoriesModel;
  }

  async getCategories(
    dto: QueryCategoryDto
  ): Promise<{ items: ICategories[]; pagination: PaginationMeta }> {
    const { page, limit, skip } = PaginationUtil.getPagination(dto);

    const sort = SortUtil.getSort({
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });

    const baseFilter: any = { isDeleted: false };

    const searchFilter =
      dto.search && dto.search.trim().length > 0
        ? {
            $or: [
              { name: { $regex: dto.search, $options: "i" } },
              { slug: { $regex: dto.search, $options: "i" } },
            ],
          }
        : {};

    const mongoFilter = {
      ...baseFilter,
      ...searchFilter,
    };

    const pipeline: PipelineStage[] = [
      { $match: mongoFilter },
      { $sort: sort },
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          meta: [{ $count: "total" }],
        },
      },
    ];

    const result = await this.CategoriesModel.aggregate(pipeline);
    const items = result[0]?.items || [];
    const total = result[0]?.meta?.[0]?.total || 0;

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createCategory(dto: CreateCategoryDto): Promise<ICategories> {
    const payload = {
      ...dto,
      isDeleted: false,
      isActive: true,
    };

    return await this.CategoriesModel.create(payload);
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto
  ): Promise<ICategories> {
    const category = await this.CategoriesModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...dto, updatedAt: new Date() },
      { new: true }
    );

    if (!category) throw new ApiError(404, "Category not found");

    return category;
  }

  async softDeleteCategory(id: string): Promise<ICategories> {
    const category = await this.CategoriesModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!category) throw new ApiError(404, "Category not found");

    return category;
  }

  async getCategoryById(id: string): Promise<ICategories> {
    const category = await this.CategoriesModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!category) throw new ApiError(404, "Category not found");

    return category;
  }
}
