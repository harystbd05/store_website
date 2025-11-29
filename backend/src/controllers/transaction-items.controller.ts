import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../utils/apiResponse";

import { TransactionItemsService } from "../services/transaction-items.service";
import {
  CreateTransactionItemDto,
  QueryTransactionItemDto,
} from "../dtos/transaction-items";
import { TransactionItems } from "../models/transaction_items";

export class TransactionItemsController {
  itemService: TransactionItemsService;

  constructor() {
    this.itemService = new TransactionItemsService(TransactionItems);

    this.getItems = this.getItems.bind(this);
    this.getItemById = this.getItemById.bind(this);
    this.createItem = this.createItem.bind(this);
  }

  async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new QueryTransactionItemDto(
        req.query as Record<string, unknown>
      );

      const { items, pagination } = await this.itemService.getItems(dto);

      res.json(new ApiResponse(items, "Transaction items list", pagination));
    } catch (err) {
      next(err);
    }
  }

  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await this.itemService.getItemById(req.params.id);
      res.json(new ApiResponse(item, "Transaction item detail"));
    } catch (err) {
      next(err);
    }
  }

  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new CreateTransactionItemDto(req.body);
      const item = await this.itemService.createItem(dto);

      res.status(201).json(new ApiResponse(item, "Transaction item created"));
    } catch (err) {
      next(err);
    }
  }
}
