import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../utils/apiResponse";
import {
  QueryCategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dtos/categories.dto";

import { CategoriesService } from "../services/categories.service";
import { Categories } from "../models/categories";

export class CategoriesController {
  categoriesService: CategoriesService;

  constructor() {
    this.categoriesService = new CategoriesService(Categories);

    this.getCategories = this.getCategories.bind(this);
    this.getCategoryById = this.getCategoryById.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.softDeleteCategory = this.softDeleteCategory.bind(this);
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new QueryCategoryDto(req.query as Record<string, unknown>);
      const { items, pagination } = await this.categoriesService.getCategories(
        dto
      );

      res.json(new ApiResponse(items, "Category list", pagination));
    } catch (err) {
      next(err);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoriesService.getCategoryById(
        req.params.id
      );

      res.json(new ApiResponse(category, "Category detail"));
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new CreateCategoryDto(req.body as Record<string, unknown>);

      const category = await this.categoriesService.createCategory(dto);

      res.status(201).json(new ApiResponse(category, "Category created"));
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new UpdateCategoryDto(req.body as Record<string, unknown>);

      const category = await this.categoriesService.updateCategory(
        req.params.id,
        dto
      );

      res.json(new ApiResponse(category, "Category updated"));
    } catch (err) {
      next(err);
    }
  }

  async softDeleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoriesService.softDeleteCategory(
        req.params.id
      );

      res.json(new ApiResponse(category, "Category deleted softly"));
    } catch (err) {
      next(err);
    }
  }
}
