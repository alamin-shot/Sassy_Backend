// backend/src/utils/jwt.utils.ts
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  userId: string;
  role: string;
  tokenFamily?: string;
}

const createSignOptions = (expiresIn: string): SignOptions => ({
  expiresIn: expiresIn as SignOptions["expiresIn"],
});

export const signAccessToken = (payload: Omit<TokenPayload, "tokenFamily">) =>
  jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET as Secret,
    createSignOptions(env.ACCESS_TOKEN_EXPIRY as string),
  );

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET as Secret,
    createSignOptions(env.REFRESH_TOKEN_EXPIRY as string),
  );

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as TokenPayload;

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as TokenPayload;
