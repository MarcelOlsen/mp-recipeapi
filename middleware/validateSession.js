import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateSession = async (req, res, next) => {
  const { __recipe_session } = req.cookies;

  const session = await prisma.session.findFirst({
    where: {
      id: __recipe_session,
    },
  });

  if (!session) return res.status(401).message("Invalid session id.");

  const now = new Date();
  const isExpired = session.expirationDate >= now;

  if (isExpired) {
    await prisma.session.delete({
      where: {
        id: __recipe_session,
      },
    });
  }

  next();
};
