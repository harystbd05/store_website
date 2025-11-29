import { Model, PipelineStage, Types } from "mongoose";

import { PaginationUtil } from "../utils/pagination";
import { SortUtil } from "../utils/sort";
import { PaginationMeta } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import {
  CreateTransactionItemDto,
  QueryTransactionItemDto,
} from "../dtos/transaction-items";
import { ITransactionItem } from "../models/transaction_items";

export class TransactionItemsService {
  private ItemModel: Model<ITransactionItem>;

  constructor(ItemModel: Model<ITransactionItem>) {
    this.ItemModel = ItemModel;
  }

  async getItems(
    dto: QueryTransactionItemDto
  ): Promise<{ items: ITransactionItem[]; pagination: PaginationMeta }> {
    const { page, limit, skip } = PaginationUtil.getPagination(dto);

    const sort = SortUtil.getSort({
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });

    const filter: any = {};

    if (dto.transactionId) {
      filter.transactionId = new Types.ObjectId(dto.transactionId);
    }

    if (dto.productId) {
      filter.productId = new Types.ObjectId(dto.productId);
    }

    const pipeline: PipelineStage[] = [
      { $match: filter },
      { $sort: sort },
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          meta: [{ $count: "total" }],
        },
      },
    ];

    const result = await this.ItemModel.aggregate(pipeline);
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

  async createItem(dto: CreateTransactionItemDto): Promise<ITransactionItem> {
    const payload = {
      ...dto,
      transactionId: new Types.ObjectId(dto.transactionId),
      productId: new Types.ObjectId(dto.productId),
    };

    return await this.ItemModel.create(payload);
  }

  async getItemById(id: string): Promise<ITransactionItem> {
    const item = await this.ItemModel.findById(id);
    if (!item) throw new ApiError(404, "Transaction item not found");
    return item;
  }
}
