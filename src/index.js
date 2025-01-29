import express from "express";

import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";

import { RecipeRouter } from "./routers/recipes.js";
import { CategoryRouter } from "./routers/categories.js";
import { ApiKeysRouter } from "./routers/apiKeys.js";
import { validateApiKey } from "./middleware/validateApiKey.js";

import { validateJWT } from "./middleware/validateJWT.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

const PORT = 3002;

app.get("/", async (req, res) => {
  // const recipes = await prisma.recipe.findMany();

  // res.send({ recipes });
  console.log(req.cookies);
  res.send({ cookies: req.cookies });
});

// app.get("/sessionTest", validateSession, (req, res) => {
//   res.status(200).send({ message: "session success!" });
// });

// app.post("/sessionTesting", async (req, res) => {
//   const newSessionId = generateSessionId();

//   const now = new Date();
//   now.setSeconds(now.getSeconds() + 20);

//   const session = prisma.session.create({
//     data: {
//       id: newSessionId,
//       expirationDate: now,
//     },
//   });

//   res.send({ message: session });
// });
//

app.get("/jwtTest", validateJWT, (req, res) => {
  res.status(200).send("successfully authenticated!");
});

app.use("/recipes", validateApiKey, RecipeRouter);
app.use("/categories", validateApiKey, CategoryRouter);
app.use("/apikeys", validateApiKey, ApiKeysRouter);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
