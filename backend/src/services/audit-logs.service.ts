import { PipelineStage, Model } from "mongoose";

import { PaginationMeta } from "../utils/apiResponse";
import { PaginationUtil } from "../utils/pagination";
import { SortUtil } from "../utils/sort";
import { ApiError } from "../utils/apiError";

import { IAuditLog } from "../models/audit_logs";
import { CreateAuditLogDto, QueryAuditLogDto } from "../dtos/audit-logs";

export class AuditLogsService {
  private AuditModel: Model<IAuditLog>;

  constructor(AuditModel: Model<IAuditLog>) {
    this.AuditModel = AuditModel;
  }

  async getLogs(
    dto: QueryAuditLogDto
  ): Promise<{ items: IAuditLog[]; pagination: PaginationMeta }> {
    const { page, limit, skip } = PaginationUtil.getPagination(dto);

    const sort = SortUtil.getSort({
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });

    const baseFilter: any = {};

    if (dto.userId) baseFilter.userId = dto.userId;

    const searchFilter =
      dto.search && dto.search.trim().length > 0
        ? {
            $or: [
              { action: { $regex: dto.search, $options: "i" } },
              { description: { $regex: dto.search, $options: "i" } },
            ],
          }
        : {};

    const mongoFilter = { ...baseFilter, ...searchFilter };

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

    const result = await this.AuditModel.aggregate(pipeline);
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

  async createLog(dto: CreateAuditLogDto): Promise<IAuditLog> {
    const payload = {
      ...dto,
    };

    return await this.AuditModel.create(payload);
  }

  async getLogById(id: string): Promise<IAuditLog> {
    const log = await this.AuditModel.findById(id);
    if (!log) throw new ApiError(404, "Audit log not found");

    return log;
  }
}
