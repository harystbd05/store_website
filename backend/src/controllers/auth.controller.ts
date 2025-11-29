import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../utils/apiResponse";
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from "../dtos/auth.dto";

import { AuthService } from "../services/auth.service";
import { User } from "../models/user";

export class AuthController {
  authService: AuthService;

  constructor() {
    this.authService = new AuthService(User);

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new RegisterDto(req.body);
      const result = await this.authService.register(dto);
      res.status(201).json(new ApiResponse(result, "User registered"));
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new LoginDto(req.body);
      const result = await this.authService.login(dto);
      res.json(new ApiResponse(result, "Login success"));
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new ForgotPasswordDto(req.body);
      const result = await this.authService.forgotPassword(dto);
      res.json(new ApiResponse(result, "Reset token generated"));
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new ResetPasswordDto(req.body);
      const result = await this.authService.resetPassword(dto);
      res.json(new ApiResponse(result, "Password updated"));
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new ChangePasswordDto(req.body);
      const userId = (req as any).user.id;
      const result = await this.authService.changePassword(userId, dto);
      res.json(new ApiResponse(result, "Password changed"));
    } catch (err) {
      next(err);
    }
  }
}
