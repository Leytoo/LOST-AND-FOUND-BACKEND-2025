import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const generateToken = (userId: string, extraPayload: object = {}) => {
  const sessionId = uuidv4();
  return jwt.sign(
    { id: userId, sessionId, ...extraPayload },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};
