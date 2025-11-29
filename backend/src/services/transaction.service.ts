import { Model, PipelineStage, Types } from "mongoose";

import { PaginationUtil } from "../utils/pagination";
import { SortUtil } from "../utils/sort";
import { PaginationMeta } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import {
  QueryTransactionDto,
  CreateTransactionDto,
  UpdateTransactionDto,
} from "../dtos/transaction.dto";
import { ITransaction } from "../models/transactions";

export class TransactionService {
  private TransactionModel: Model<ITransaction>;

  constructor(TransactionModel: Model<ITransaction>) {
    this.TransactionModel = TransactionModel;
  }

  async getTransactions(
    dto: QueryTransactionDto
  ): Promise<{ items: ITransaction[]; pagination: PaginationMeta }> {
    const { page, limit, skip } = PaginationUtil.getPagination(dto);

    const sort = SortUtil.getSort({
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });

    const filter: any = { isDeleted: false };

    if (dto.userId) {
      filter.userId = new Types.ObjectId(dto.userId);
    }

    if (dto.paymentStatus) {
      filter.paymentStatus = dto.paymentStatus;
    }

    if (dto.paymentMethod) {
      filter.paymentMethod = dto.paymentMethod;
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

    const result = await this.TransactionModel.aggregate(pipeline);
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

  async createTransaction(dto: CreateTransactionDto): Promise<ITransaction> {
    const payload = {
      userId: new Types.ObjectId(dto.userId),
      totalAmount: dto.totalAmount,
      currency: dto.currency,
      paymentStatus: dto.paymentStatus,
      paymentMethod: dto.paymentMethod,
      invoiceCode: dto.invoiceCode,
      isDeleted: false,
    };

    return await this.TransactionModel.create(payload);
  }

  async updateTransaction(
    id: string,
    dto: UpdateTransactionDto
  ): Promise<ITransaction> {
    const transaction = await this.TransactionModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...dto, updatedAt: new Date() },
      { new: true }
    );

    if (!transaction) {
      throw new ApiError(404, "Transaction not found");
    }

    return transaction;
  }

  async softDeleteTransaction(id: string): Promise<ITransaction> {
    const transaction = await this.TransactionModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!transaction) {
      throw new ApiError(404, "Transaction not found");
    }

    return transaction;
  }

  async getTransactionById(id: string): Promise<ITransaction> {
    const transaction = await this.TransactionModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!transaction) {
      throw new ApiError(404, "Transaction not found");
    }

    return transaction;
  }
}
