import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { IUser } from "@/models/user/user.types";
import Config from "@/config";
import UserModel from "@/models/user/user.model";
import errorManager from "@/utils/error-manager";

interface IRegisterInput {
  user_name: string;
  user_email: string;
  user_password: string;
}

interface ILoginInput {
  user_email: string;
  user_password: string;
}

interface IJWTPayload {
  user_id: string;
  user_email: string;
  user_role: "user" | "admin";
}

const generateToken = (payload: IJWTPayload): string => {
  // eslint-disable-next-line import/no-named-as-default-member
  return jwt.sign(payload, Config.env.jwt_secret, {
    expiresIn: Config.env.jwt_expires_in,
  } as jwt.SignOptions);
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

const register = async (data: IRegisterInput) => {
  const existingUser = await UserModel.findOne({ user_email: data.user_email, user_archived: false });
  if (existingUser) {
    throw errorManager.getHttpError("EMAIL_ALREADY_EXIST");
  }

  const user = await UserModel.create({
    user_name: data.user_name,
    user_email: data.user_email,
    user_password: data.user_password,
    user_role: "user", // Always create as normal user
    user_status: "active",
  });

  const token = generateToken({
    user_id: user.user_id,
    user_email: user.user_email,
    user_role: user.user_role,
  });

  const userObject = user.toObject() as IUser;
  delete userObject.user_password;

  return {
    user: userObject,
    token,
  };
};

const login = async (data: ILoginInput) => {
  const user = await UserModel.findOne({ user_email: data.user_email, user_archived: false });
  if (!user) {
    throw errorManager.getHttpError("INVALID_CREDENTIALS");
  }

  if (!user.user_password) {
    throw errorManager.getHttpError("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await comparePassword(data.user_password, user.user_password);
  if (!isPasswordValid) {
    throw errorManager.getHttpError("INVALID_CREDENTIALS");
  }

  const token = generateToken({
    user_id: user.user_id,
    user_email: user.user_email,
    user_role: user.user_role,
  });

  const userObject = user.toObject() as IUser;
  delete userObject.user_password;

  return {
    user: userObject,
    token,
  };
};

const getMe = async (userId: string) => {
  const user = await UserModel.findOne({ user_id: userId, user_archived: false }).select("-user_password");
  if (!user) {
    throw errorManager.getHttpError("USER_NOT_FOUND");
  }
  return user;
};

export default {
  register,
  login,
  getMe,
  generateToken,
  hashPassword,
  comparePassword,
};
