import { createHmac } from "crypto";

export const createSignature = (header, payload, secret) => {
  const data = `${header}.${payload}`;
  return createHmac("sha256", secret).update(data).digest("base64url");
};
