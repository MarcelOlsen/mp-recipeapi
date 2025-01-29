import express from "express";
import { PrismaClient } from "@prisma/client";

import { generateApiKey } from "./utils/generateApiKey.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const newApiKey = generateApiKey();

  await prisma.apiKey
    .create({
      data: {
        apiKey: newApiKey,
      },
    })
    .catch((error) => {
      console.error(error);
      res.send({ message: "Failed to create a new api key." });
    });

  res.send({ apiKey: newApiKey });
});

router.post("/revoke", async (req, res) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res.status(400).json({ message: "No API key provided" });
  }

  try {
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        apiKey: apiKey,
      },
    });

    if (!existingKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    if (existingKey.revoked) {
      return res.status(400).json({ message: "API key is already revoked" });
    }

    const updatedApiKey = await prisma.apiKey.update({
      where: {
        apiKey: apiKey,
      },
      data: {
        revoked: true,
      },
    });

    return res.status(200).json({
      message: "API key revoked successfully",
      udpatedApiKey: updatedApiKey,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to revoke API key",
      error: error.message,
    });
  }
});

export { router as ApiKeysRouter };
