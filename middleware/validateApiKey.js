import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateApiKey = async (req, res, next) => {
  const apiKey = req.get("x-api-key");

  if (req.url === "/apikeys" && req.method === "POST") {
    next();
  }

  if (!apiKey) {
    return res.status(401).json({ message: "API key is required." });
  }

  const doesApiKeyExist = await prisma.apiKey.findFirst({
    where: {
      apiKey: apiKey,
    },
  });

  console.log(doesApiKeyExist);

  if (!doesApiKeyExist)
    return res.status(401).json({ message: "Inavlid API key provided." });

  next();
};
