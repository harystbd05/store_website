import { PipelineStage, Model } from "mongoose";
import { IUser } from "../models/user";
import { PaginationUtil } from "../utils/pagination";
import { SortUtil } from "../utils/sort";
import { PaginationMeta } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { CreateUserDto, QueryUserDto, UpdateUserDto } from "../dtos/user.dto";

export class UserService {
  private UserModel: Model<IUser>;

  constructor(UserModel: Model<IUser>) {
    this.UserModel = UserModel;
  }

  async getUsers(
    dto: QueryUserDto
  ): Promise<{ items: IUser[]; pagination: PaginationMeta }> {
    const { page, limit, skip } = PaginationUtil.getPagination(dto);

    const sort = SortUtil.getSort({
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });

    const baseFilter: any = { isDeleted: false };

    if (dto.role) {
      baseFilter.role = dto.role;
    }

    const searchFilter =
      dto.search && dto.search.trim().length > 0
        ? {
            $or: [
              { fullName: { $regex: dto.search, $options: "i" } },
              { email: { $regex: dto.search, $options: "i" } },
            ],
          }
        : {};

    const mongoFilter = {
      ...baseFilter,
      ...searchFilter,
    };

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

    const result = await this.UserModel.aggregate(pipeline);
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

  async createUser(dto: CreateUserDto): Promise<IUser> {
    const payload = {
      ...dto,
      isDeleted: false,
      isActive: true,
    };

    return await this.UserModel.create(payload);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<IUser> {
    const user = await this.UserModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...dto, updatedAt: new Date() },
      { new: true }
    );

    if (!user) throw new ApiError(404, "User not found");

    return user;
  }

  async softDeleteUser(id: string): Promise<IUser> {
    const user = await this.UserModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        isActive: false,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) throw new ApiError(404, "User not found");

    return user;
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.UserModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!user) throw new ApiError(404, "User not found");

    return user;
  }
}
