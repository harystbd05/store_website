import { Model, PipelineStage, Types } from "mongoose";

import { PaginationMeta } from "../utils/apiResponse";
import { PaginationUtil } from "../utils/pagination";
import { SortUtil } from "../utils/sort";
import { ApiError } from "../utils/apiError";
import { CreatePaymentLogDto, QueryPaymentLogDto } from "../dtos/payment-logs";
import { IPaymentLogs } from "../models/payment_logs";

export class PaymentLogsService {
  private PaymentModel: Model<IPaymentLogs>;

  constructor(PaymentModel: Model<IPaymentLogs>) {
    this.PaymentModel = PaymentModel;
  }

  async getLogs(
    dto: QueryPaymentLogDto
  ): Promise<{ items: IPaymentLogs[]; pagination: PaginationMeta }> {
    const { page, limit, skip } = PaginationUtil.getPagination(dto);

    const sort = SortUtil.getSort({
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });

    const filter: any = { isDeleted: false };

    if (dto.paymentStatus) filter.paymentStatus = dto.paymentStatus;
    if (dto.paymentMethod) filter.paymentMethod = dto.paymentMethod;
    if (dto.userId) filter.userId = new Types.ObjectId(dto.userId);

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

    const result = await this.PaymentModel.aggregate(pipeline);

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

  async createLog(dto: CreatePaymentLogDto): Promise<IPaymentLogs> {
    const payload = {
      ...dto,
      isDeleted: false,
    };

    return await this.PaymentModel.create(payload);
  }

  async getLogById(id: string): Promise<IPaymentLogs> {
    const log = await this.PaymentModel.findOne({ _id: id, isDeleted: false });
    if (!log) throw new ApiError(404, "Payment log not found");
    return log;
  }
}
