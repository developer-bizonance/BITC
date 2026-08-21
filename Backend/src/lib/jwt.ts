import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "bitc_secure_jwt_secret_token_key_2026_bizonance";

export interface JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}
