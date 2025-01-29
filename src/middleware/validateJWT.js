import { createSignature } from "../utils/createSignature.js";

export const SECRET = "owca";

const verifyJWT = (token, secret) => {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) throw new Error("Invalid JWT");

  const validSignature = createSignature(header, payload, secret);

  if (signature !== validSignature) throw new Error("Invalid JWT");

  const decodedPayload = JSON.parse(
    Buffer.from(payload, "base64url").toString(),
  );
  if (decodedPayload.exp < Math.floor(Date.now() / 1000))
    throw new Error("JWT expired");

  return decodedPayload;
};

export const validateJWT = (req, res, next) => {
  const { jwt } = req.cookies;

  if (verifyJWT(jwt, SECRET)) next();

  res.send("Invalid JWT");
};
