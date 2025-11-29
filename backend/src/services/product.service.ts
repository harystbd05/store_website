import { Model, PipelineStage, Types } from "mongoose";
import { IProduct } from "../models/product";

import { PaginationUtil } from "../utils/pagination";
import { SortUtil } from "../utils/sort";
import { PaginationMeta } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

import {
  QueryProductDto,
  CreateProductDto,
  UpdateProductDto,
} from "../dtos/product.dto";

export class ProductService {
  private ProductModel: Model<IProduct>;

  constructor(ProductModel: Model<IProduct>) {
    this.ProductModel = ProductModel;
  }

  async getProducts(
    dto: QueryProductDto
  ): Promise<{ items: IProduct[]; pagination: PaginationMeta }> {
    const { page, limit, skip } = PaginationUtil.getPagination(dto);

    const sort = SortUtil.getSort({
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });

    const filter: any = { isDeleted: false, isActive: true };

    if (dto.platform) filter.platform = dto.platform;
    if (dto.categoryId) filter.categoryId = new Types.ObjectId(dto.categoryId);
    if (dto.sellerId) filter.sellerId = new Types.ObjectId(dto.sellerId);

    const searchFilter =
      dto.search && dto.search.trim().length > 0
        ? {
            $or: [
              { name: { $regex: dto.search, $options: "i" } },
              { description: { $regex: dto.search, $options: "i" } },
            ],
          }
        : {};

    const mongoFilter = {
      ...filter,
      ...searchFilter,
    };

    const pipeline: PipelineStage[] = [
      { $match: mongoFilter },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      {
        $lookup: {
          from: "users",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },

      { $sort: sort },

      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          meta: [{ $count: "total" }],
        },
      },
    ];

    const result = await this.ProductModel.aggregate(pipeline);

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

  async createProduct(dto: CreateProductDto): Promise<IProduct> {
    const payload = {
      ...dto,
      categoryId: new Types.ObjectId(dto.categoryId),
      sellerId: new Types.ObjectId(dto.sellerId),
      isDeleted: false,
      isActive: true,
    };

    return await this.ProductModel.create(payload);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<IProduct> {
    const updateData: any = {
      ...dto,
      updatedAt: new Date(),
    };

    if (dto.categoryId) {
      updateData.categoryId = new Types.ObjectId(dto.categoryId);
    }

    if (dto.sellerId) {
      updateData.sellerId = new Types.ObjectId(dto.sellerId);
    }

    const product = await this.ProductModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!product) throw new ApiError(404, "Product not found");

    return product;
  }

  async softDeleteProduct(id: string): Promise<IProduct> {
    const product = await this.ProductModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!product) throw new ApiError(404, "Product not found");

    return product;
  }

  async getProductById(id: string): Promise<IProduct> {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new Types.ObjectId(id), isDeleted: false } },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      {
        $lookup: {
          from: "users",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
    ];

    const product = await this.ProductModel.aggregate(pipeline);

    if (!product.length) throw new ApiError(404, "Product not found");

    return product[0];
  }
}
