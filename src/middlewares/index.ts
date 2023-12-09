import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
import { HttpStatusCode } from "../util";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
interface Form {
  username: string;
  password: string;
}

export const passwordEncrypt: Middleware = async (req, res, next) => {
  res.status(HttpStatusCode.BadRequest);
  try {
    const form: Form = req.body.form;
    const saltRounds: number = +process.env.SALT;
    const pass = await bcrypt.hash(form.password, saltRounds);
    req.body.form.password = pass;
    next();
  } catch (e) {
    next(e);
  }
};

export const validatePassword: Middleware = async (req, res, next) => {
  res.status(HttpStatusCode.BadRequest);
  try {
    const form: Form = req.body.form;
    const user = await prisma.user.findFirst({
      where: {
        username: form.username,
      },
    });

    if (!user) {
      res.status(HttpStatusCode.NotFound);
      throw new Error("User not found");
    }

    console.log(user);
    const comp: boolean = await bcrypt.compare(form.password, user.password);
    if (!comp) {
      console.log(user.password);
      console.log(form.password);
      res.status(HttpStatusCode.Unauthorized);
      throw new Error("Wrong password");
    }

    next();
  } catch (e) {
    next(e);
  }
};

export const validateToken: Middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(HttpStatusCode.BadRequest);
  try {
    let token = "",
      payload: jwt.JwtPayload | string;
    try {
      token = req.headers.authorization.split("Bearer ")[1];
      // console.log(token);
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw e;
    }

    if (typeof payload === "string") {
      throw new Error("Payload is not correct");
    }

    const username: string | undefined = payload.username;

    if (!username) {
      throw new Error("Username is undefined");
    }

    req.body.form = {
      username,
    };

    req.headers.usernames = [username];

    next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export const validateRefreshToken: Middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(HttpStatusCode.BadRequest);
  try {
    let token = "",
      payload: jwt.JwtPayload | string;
    try {
      token = req.body.data.refreshToken;
      console.log(token);
      payload = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (e) {
      throw e;
    }

    if (typeof payload === "string") {
      throw new Error("Payload is not correct");
    }

    const username: string | undefined = payload.username;

    if (!username) {
      throw new Error("Username is undefined");
    }

    req.body.form = {
      username,
    };

    next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};
