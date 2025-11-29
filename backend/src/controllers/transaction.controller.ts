import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../utils/apiResponse";
import {
  QueryTransactionDto,
  CreateTransactionDto,
  UpdateTransactionDto,
} from "../dtos/transaction.dto";

import { TransactionService } from "../services/transaction.service";
import { Transaction } from "../models/transactions";

export class TransactionController {
  transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService(Transaction);

    this.getTransactions = this.getTransactions.bind(this);
    this.getTransactionById = this.getTransactionById.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.softDeleteTransaction = this.softDeleteTransaction.bind(this);
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new QueryTransactionDto(req.query as Record<string, unknown>);
      const { items, pagination } =
        await this.transactionService.getTransactions(dto);

      res.json(new ApiResponse(items, "Transaction list", pagination));
    } catch (err) {
      next(err);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await this.transactionService.getTransactionById(
        req.params.id
      );
      res.json(new ApiResponse(transaction, "Transaction detail"));
    } catch (err) {
      next(err);
    }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new CreateTransactionDto(req.body as Record<string, unknown>);
      const transaction = await this.transactionService.createTransaction(dto);

      res.status(201).json(new ApiResponse(transaction, "Transaction created"));
    } catch (err) {
      next(err);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new UpdateTransactionDto(req.body as Record<string, unknown>);
      const transaction = await this.transactionService.updateTransaction(
        req.params.id,
        dto
      );
      res.json(new ApiResponse(transaction, "Transaction updated"));
    } catch (err) {
      next(err);
    }
  }

  async softDeleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await this.transactionService.softDeleteTransaction(
        req.params.id
      );
      res.json(new ApiResponse(transaction, "Transaction deleted softly"));
    } catch (err) {
      next(err);
    }
  }
}
