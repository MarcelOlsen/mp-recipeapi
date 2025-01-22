import express from "express";

import { PrismaClient } from "@prisma/client";

import { RecipeRouter } from "./recipes.js";
import { CategoryRouter } from "./categories.js";
import { ApiKeysRouter } from "./apiKeys.js";
import { validateApiKey } from "./middleware/validateApiKey.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(validateApiKey);

const PORT = 3002;

app.get("/", async (req, res) => {
  const recipes = await prisma.recipe.findMany();

  res.send({ recipes });
});

app.use("/recipes", RecipeRouter);
app.use("/categories", CategoryRouter);
app.use("/apikeys", validateApiKey, ApiKeysRouter);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
