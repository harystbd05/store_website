import { Model } from "mongoose";
import crypto from "crypto";
import { IUser } from "../models/user";
import { ApiError } from "../utils/apiError";
import { JwtUtil } from "../utils/jwt";
import { PasswordUtil } from "../utils/password";

import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from "../dtos/auth.dto";

export class AuthService {
  private UserModel: Model<IUser>;

  constructor(UserModel: Model<IUser>) {
    this.UserModel = UserModel;
  }

  async register(dto: RegisterDto) {
    const exists = await this.UserModel.findOne({ email: dto.email });
    if (exists) throw new ApiError(400, "Email already exists");

    const passwordHash = await PasswordUtil.hash(dto.password);

    const user = await this.UserModel.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      phone: dto.phone,
      role: "customer",
      isActive: true,
      isDeleted: false,
    });

    const token = JwtUtil.sign({ id: user._id, role: user.role });

    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.UserModel.findOne({
      email: dto.email,
      isDeleted: false,
    });

    if (!user) throw new ApiError(404, "User not found");

    const match = await PasswordUtil.compare(dto.password, user.passwordHash);
    if (!match) throw new ApiError(401, "Invalid credentials");

    const token = JwtUtil.sign({ id: user._id, role: user.role });

    return { user, token };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.UserModel.findOne({
      email: dto.email,
      isDeleted: false,
    });
    if (!user) throw new ApiError(404, "User not found");

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
    await user.save();

    return { token }; // ini nanti dikirim via email
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.UserModel.findOne({
      resetToken: dto.token,
      resetTokenExpiry: { $gt: new Date() },
      isDeleted: false,
    });

    if (!user) throw new ApiError(400, "Invalid/Expired token");

    user.passwordHash = await PasswordUtil.hash(dto.password);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return { message: "Password updated" };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.UserModel.findOne({
      _id: userId,
      isDeleted: false,
    });

    if (!user) throw new ApiError(404, "User not found");

    const match = await PasswordUtil.compare(
      dto.oldPassword,
      user.passwordHash
    );
    if (!match) throw new ApiError(401, "Old password incorrect");

    user.passwordHash = await PasswordUtil.hash(dto.newPassword);
    await user.save();

    return { message: "Password changed" };
  }
}
