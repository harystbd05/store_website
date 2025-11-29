import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../utils/jwt";
import { ApiError } from "../utils/apiError";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer "))
    throw new ApiError(401, "Unauthorized");

  const token = header.split(" ")[1];

  try {
    const payload = JwtUtil.verify(token);
    (req as any).user = payload;
    next();
  } catch {
    throw new ApiError(401, "Invalid token");
  }
};
