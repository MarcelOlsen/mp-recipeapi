import * as crypto from "crypto";

export const generateSessionId = () => {
  return crypto.randomBytes(64).toString("hex");
};
