import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../utils/apiResponse";
import { QueryUserDto, CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { User } from "../models/user";
import { UserService } from "../services/user.service";

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService(User);

    this.getUsers = this.getUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.softDeleteUser = this.softDeleteUser.bind(this);
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new QueryUserDto(req.query as Record<string, unknown>);
      const { items, pagination } = await this.userService.getUsers(dto);
      res.json(new ApiResponse(items, "User list", pagination));
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(new ApiResponse(user, "User detail"));
    } catch (err) {
      next(err);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new CreateUserDto(req.body as Record<string, unknown>);
      const user = await this.userService.createUser(dto);
      res.status(201).json(new ApiResponse(user, "User created"));
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new UpdateUserDto(req.body as Record<string, unknown>);
      const user = await this.userService.updateUser(req.params.id, dto);
      res.json(new ApiResponse(user, "User updated"));
    } catch (err) {
      next(err);
    }
  }

  async softDeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.softDeleteUser(req.params.id);
      res.json(new ApiResponse(user, "User deleted softly"));
    } catch (err) {
      next(err);
    }
  }
}
