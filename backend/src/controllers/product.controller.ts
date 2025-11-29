import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../utils/apiResponse";
import {
  QueryProductDto,
  CreateProductDto,
  UpdateProductDto,
} from "../dtos/product.dto";

import { ProductService } from "../services/product.service";
import { Product } from "../models/product";

export class ProductController {
  productService: ProductService;

  constructor() {
    this.productService = new ProductService(Product);

    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.softDeleteProduct = this.softDeleteProduct.bind(this);
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new QueryProductDto(req.query);
      const { items, pagination } = await this.productService.getProducts(dto);

      res.json(new ApiResponse(items, "Product list", pagination));
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.json(new ApiResponse(product, "Product detail"));
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new CreateProductDto(req.body);
      const product = await this.productService.createProduct(dto);

      res.status(201).json(new ApiResponse(product, "Product created"));
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new UpdateProductDto(req.body);
      const product = await this.productService.updateProduct(
        req.params.id,
        dto
      );

      res.json(new ApiResponse(product, "Product updated"));
    } catch (err) {
      next(err);
    }
  }

  async softDeleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productService.softDeleteProduct(
        req.params.id
      );
      res.json(new ApiResponse(product, "Product deleted softly"));
    } catch (err) {
      next(err);
    }
  }
}
