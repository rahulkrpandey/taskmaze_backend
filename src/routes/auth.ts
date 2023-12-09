import express, { NextFunction, Request, Response } from "express";
import {
  passwordEncrypt,
  validatePassword,
  validateRefreshToken,
} from "../middlewares";
import { HttpStatusCode, generateRefreshAndJwtToken } from "../util";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/refresh",
  validateRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken, accessToken, time } = generateRefreshAndJwtToken(
        req.body.form.username
      );

      return res.status(HttpStatusCode.OK).json({
        accessToken,
        refreshToken,
        expiresIn: time,
        username: req.body.form.username,
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/login",
  validatePassword,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken, accessToken, time } = generateRefreshAndJwtToken(
        req.body.form.username
      );

      return res.status(HttpStatusCode.OK).json({
        accessToken,
        refreshToken,
        expiresIn: time,
        username: req.body.form.username,
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/signup",
  passwordEncrypt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form: {
        username: string;
        password: string;
      } = req.body.form;

      await prisma.user.create({
        data: {
          ...form,
        },
      });

      console.log(form);
      res.status(HttpStatusCode.Created).send("User created");
    } catch (e) {
      res.status(HttpStatusCode.BadRequest);
      next(e);
    }
  }
);

export default router;
