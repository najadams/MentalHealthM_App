import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { AuthRequest } from "../types";

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    // Check if the token is in the invalidated tokens list
    if (user.invalidatedTokens && user.invalidatedTokens.includes(token)) {
      throw new Error("Token has been invalidated");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate." });
  }
};
