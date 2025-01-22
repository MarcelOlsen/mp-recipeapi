import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/:name", async (req, res) => {
  const { name } = req.params;

  const recipes = await prisma.recipe
    .findMany({
      where: {
        category: {
          equals: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        cookingTime: true,
      },
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        message: "Something went wrong while fetching the recipe by category.",
      });
    });

  res.status(200).json({ recipes });
});

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({}).catch((error) => {
    console.error(error);
    res.status(500).json({ message: "There was an error fetching categories" });
  });

  res.status(200).json({ categories });
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  const newCategory = await prisma.category
    .create({
      data: {
        name,
      },
    })
    .catch((error) => {
      res.status(500).json({ message: "Failed to create category." });
    });

  res.status(200).json({ category: newCategory });
});

export { router as CategoryRouter };
