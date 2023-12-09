import express, { NextFunction, Request, Response, response } from "express";
import {
  passwordEncrypt,
  validatePassword,
  validateToken,
} from "../middlewares";
import { HttpStatusCode } from "../util";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.put(
  "/:id",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const project = await prisma.project.findUnique({
        where: {
          id,
        },
      });

      if (!project) {
        res.status(HttpStatusCode.NotFound);
        throw new Error("Project does not exist");
      }

      const { usernames } = req.headers;
      if (!project.users.includes(usernames[0])) {
        res.status(HttpStatusCode.Unauthorized);
        throw new Error("You are not authorized");
      }

      await prisma.project.update({
        where: {
          id,
        },
        data: {
          ...req.body.data,
        },
      });

      res.status(HttpStatusCode.OK).send("Project updated");
    } catch (e) {
      next(e);
    }
  }
);
// Create projects
router.post(
  "/",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usernames } = req.headers;

      const users = usernames;
      console.log(users);
      await prisma.project.create({
        data: {
          ...req.body.data,
          users,
        },
      });

      res.status(HttpStatusCode.Created).send("Project created");
    } catch (e) {
      next(e);
    }
  }
);

// Get all projects
router.get(
  "/",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usernames } = req.headers;
      const user = usernames[0];
      const projects = await prisma.project.findMany({
        where: {
          users: {
            has: user,
          },
        },
      });
      res.status(HttpStatusCode.OK).json(projects);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/:id",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const project = await prisma.project.findFirst({
        where: {
          id,
        },
      });

      if (!project) {
        res.status(HttpStatusCode.NotFound);
        throw new Error("Project not found");
      }

      const { usernames } = req.headers;
      console.log(usernames);

      if (!project.users.includes(usernames[0])) {
        response.status(HttpStatusCode.Unauthorized);
        throw new Error("You are not authorized");
      }

      res.status(HttpStatusCode.OK).json(project);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/:id",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const project = await prisma.project.findFirst({
        where: {
          id,
        },
      });

      if (!project) {
        res.status(HttpStatusCode.NotFound);
        throw new Error("Project not found");
      }

      const { usernames } = req.headers;
      if (!usernames) {
        throw new Error("User not found");
      }

      if (!project.users.includes(usernames[0])) {
        res.status(HttpStatusCode.Unauthorized);
        throw new Error("You are not authorized");
      }

      await prisma.project.delete({
        where: {
          id,
        },
      });

      res.status(HttpStatusCode.OK).send("Project deleted");
    } catch (e) {
      next(e);
    }
  }
);

export default router;
