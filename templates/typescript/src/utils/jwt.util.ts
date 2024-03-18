import CryptoJS from "crypto-js";
import type { NextFunction, Request, Response } from "express";
import * as jose from "jose";
import moment from "moment";
import User from "src/models/User";

const SECRET = "lTFNnCd4sxWpOs0fBy8N70mtQj6EfhG8pVfHf9OprO8=";

export async function generateToken(
  payload: object,
  secret?: string
): Promise<any> {
  const secretEncoded = new TextEncoder().encode(secret || SECRET);

  const jwt = await new jose.SignJWT({
    ...payload,
    exp: moment().add(24, "hours").unix(),
  }).setProtectedHeader({ alg: "HS256" });

  const token = await jwt.sign(secretEncoded, {});

  return token;
}

const encryptionKey = "thisisveryverysecret";

export function encryptPrivateKey(privateKey: string) {
  const encryptedPrivateKey = CryptoJS.AES.encrypt(
    privateKey,
    encryptionKey
  ).toString();

  return encryptedPrivateKey;
}

export function decryptPrivateKey(encryptedPrivateKey: string) {
  const decryptedPrivateKeyBytes = CryptoJS.AES.decrypt(
    encryptedPrivateKey,
    encryptionKey
  );

  const decryptedPrivateKey = decryptedPrivateKeyBytes.toString(
    CryptoJS.enc.Utf8
  );

  return decryptedPrivateKey;
}

export async function decodeToken(token: string, secret?: string) {
  const secretEncoded = new TextEncoder().encode(secret || SECRET);

  const { payload } = await jose.jwtVerify(token, secretEncoded);
  return payload;
}

export async function Authenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token = String(req.headers.Authorization || req.headers.authorization);

    if (!token.startsWith("Bearer")) return res.unauth();

    token = token.split(" ")[1];

    if (!token) return res.unauth();

    const decoded = await decodeToken(token);

    if (!decoded) return res.unauth("invalid authorization.");

    const user = await User.findById(decoded.id);

    if (!user) return res.unauth();

    // if (user.status === "blocked") return res.unauth("user not active");

    req.user = user;

    next();
  } catch (error: any) {
    res.unauth();
    console.error(error.message);
  }
}

export async function ApiAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {}
