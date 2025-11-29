import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../utils/apiResponse";
import { AuditLogsService } from "../services/audit-logs.service";
import { CreateAuditLogDto, QueryAuditLogDto } from "../dtos/audit-logs";
import { AuditLogs } from "../models/audit_logs";

export class AuditLogsController {
  auditService: AuditLogsService;

  constructor() {
    this.auditService = new AuditLogsService(AuditLogs);

    this.getLogs = this.getLogs.bind(this);
    this.getLogById = this.getLogById.bind(this);
    this.createLog = this.createLog.bind(this);
  }

  async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new QueryAuditLogDto(req.query);
      const { items, pagination } = await this.auditService.getLogs(dto);

      res.json(new ApiResponse(items, "Audit logs list", pagination));
    } catch (err) {
      next(err);
    }
  }

  async getLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await this.auditService.getLogById(req.params.id);
      res.json(new ApiResponse(log, "Audit log detail"));
    } catch (err) {
      next(err);
    }
  }

  async createLog(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new CreateAuditLogDto(req.body);
      const log = await this.auditService.createLog(dto);

      res.status(201).json(new ApiResponse(log, "Audit log created"));
    } catch (err) {
      next(err);
    }
  }
}
