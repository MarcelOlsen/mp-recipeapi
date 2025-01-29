import { createSignature } from "./src/utils/createSignature.js";

const jwtHeader = {
  alg: "HS256",
  typ: "JWT",
};

const jwtPayload = {
  id: 1,
  username: "testuser",
  role: "admin",
};

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const header = base64UrlEncode(JSON.stringify(jwtHeader));
const payloadWithExp = {
  ...jwtPayload,
  exp: Math.floor(Date.now() / 1000) + 10 * 60,
};

const payload = base64UrlEncode(JSON.stringify(payloadWithExp));

const signature = createSignature(header, payload, "hacker");

const jwt = `${header}.${payload}.${signature}`;

console.log(jwt);
