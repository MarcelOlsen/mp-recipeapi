import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT = 3002;

app.get("/", async (req, res) => {
  await prisma.recipe
    .findMany()
    .then((data) => res.send({ data }))
    .catch((err) => res.send({ error: err }));

  res.send({ hello: "world" });
});

app.post("/recipes", async (req, res) => {
  const { name, description, cooking_time, category, ingredients } = req.body;

  try {
    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        cookingTime: cooking_time,
        category,
        ingredients: {
          create: ingredients.map((ingredient) => ({
            ingredient: {
              connectOrCreate: {
                where: { name: ingredient.name },
                create: { name: ingredient.name },
              },
            },
            quantity: ingredient.quantity,
          })),
        },
      },
    });

    res.status(201).json({ message: "Recipe created successfully", recipe });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong while creating the recipe." });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
