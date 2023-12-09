import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import jwt from "jsonwebtoken";

export const verifyToken = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next
) => {
  try {
    let token = "",
      payload: jwt.JwtPayload | string;
    try {
      token = socket.handshake.auth.TOKEN;
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

    console.log("token is valid", socket.handshake.auth.TOKEN);
    socket.request.headers.userId = username;
    next();
  } catch (err: any) {
    console.log("server", err);
    next(err);
  }
};
