import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";

import { PaymentLogsService } from "../services/payment-logs.service";
import { PaymentLogs } from "../models/payment_logs";
import { CreatePaymentLogDto, QueryPaymentLogDto } from "../dtos/payment-logs";

export class PaymentLogsController {
  paymentService: PaymentLogsService;

  constructor() {
    this.paymentService = new PaymentLogsService(PaymentLogs);

    this.getLogs = this.getLogs.bind(this);
    this.getLogById = this.getLogById.bind(this);
    this.createLog = this.createLog.bind(this);
  }

  async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new QueryPaymentLogDto(req.query as Record<string, unknown>);
      const { items, pagination } = await this.paymentService.getLogs(dto);

      res.json(new ApiResponse(items, "Payment logs list", pagination));
    } catch (err) {
      next(err);
    }
  }

  async getLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await this.paymentService.getLogById(req.params.id);
      res.json(new ApiResponse(log, "Payment log detail"));
    } catch (err) {
      next(err);
    }
  }

  async createLog(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new CreatePaymentLogDto(req.body);
      const log = await this.paymentService.createLog(dto);

      res.status(201).json(new ApiResponse(log, "Payment log created"));
    } catch (err) {
      next(err);
    }
  }
}
