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

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        cookingTime: true,
      },
    });

    res.status(201).json({ recipes });
  } catch (error) {
    console.error(error);
    res
      .status(501)
      .json({ message: "Something went wrong while getting the recipes." });
  }
});

app.get("/recipes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const formattedRecipe = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      cooking_time: recipe.cookingTime,
      category: recipe.category,
      ingredients: recipe.ingredients.map((ing) => ({
        name: ing.ingredient.name,
        quantity: ing.quantity,
      })),
    };

    res.status(200).json(formattedRecipe);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while getting the recipe." });
  }
});

app.put("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, cooking_time, category, ingredients } = req.body;

  try {
    await prisma.recipeIngredient.deleteMany({
      where: {
        recipeId: parseInt(id),
      },
    });

    await prisma.recipe.update({
      where: {
        id: parseInt(id),
      },
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

    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while updating the recipe." });
  }
});

app.delete("/recipes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.recipe.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while deleting the recipe." });
  }
});

app.get("/recipes/search", async (req, res) => {
  const { ingredient } = req.query;

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        ingredients: {
          some: {
            ingredient: {
              name: {
                contains: ingredient,
                mode: "insensitive",
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        cookingTime: true,
        category: true,
      },
    });

    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while searching for recipes.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
