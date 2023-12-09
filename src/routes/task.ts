import express, { NextFunction, Request, Response } from "express";
import {
  passwordEncrypt,
  validatePassword,
  validateToken,
} from "../middlewares";
import { HttpStatusCode } from "../util";
import jwt from "jsonwebtoken";
import { PrismaClient, Task } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.put(
  "/all",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Task[] = req.body.data;
      const tasksarr = [];
      data.forEach(async (item) => {
        const job = prisma.task.update({
          where: {
            id: item.id,
          },
          data: {
            ...item,
          },
        });

        tasksarr.push(job);
      });

      await prisma.$transaction(tasksarr);

      res.status(HttpStatusCode.OK).send("Updated");
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/:id",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const task = await prisma.task.findUnique({
        where: {
          id,
        },
      });

      if (!task) {
        res.status(HttpStatusCode.NotFound);
        throw new Error("Task does not exist");
      }

      await prisma.task.update({
        where: {
          id,
        },
        data: {
          ...req.body.data,
        },
      });

      res.status(HttpStatusCode.OK).send("Task updated");
    } catch (e) {
      next(e);
    }
  }
);

// Create tasks
router.post(
  "/",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.task.create({
        data: {
          ...req.body.data,
        },
      });

      res.status(HttpStatusCode.Created).send("Project created");
    } catch (e) {
      next(e);
    }
  }
);

// Get all tasks
router.get(
  "/:projectid",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project_id = req.params.projectid;
      const project = await prisma.project.findFirst({
        where: {
          id: project_id,
        },
      });

      if (!project) {
        res.status(HttpStatusCode.NotFound);
        throw new Error("Project not found");
      }
      const tasks = await prisma.task.findMany({
        where: {
          project_id,
        },
        orderBy: {
          order: "asc",
        },
      });

      res.status(HttpStatusCode.OK).json({
        project,
        tasks,
      });
    } catch (e) {
      next(e);
    }
  }
);

// Get single task
router.get(
  "/one/:id",
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const project = await prisma.task.findFirst({
        where: {
          id,
        },
      });

      if (!project) {
        res.status(HttpStatusCode.NotFound);
        throw new Error("Task not found");
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
      const task = await prisma.task.findFirst({
        where: {
          id,
        },
      });

      if (!task) {
        res.status(HttpStatusCode.NotFound);
        throw new Error("Task not found");
      }

      await prisma.task.delete({
        where: {
          id,
        },
      });

      res.status(HttpStatusCode.OK).json(task);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
