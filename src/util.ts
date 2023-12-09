import jwt from "jsonwebtoken";
export enum HttpStatusCode {
  // Informational
  Continue = 100,
  SwitchingProtocols = 101,

  // Successful
  OK = 200,
  Created = 201,
  NoContent = 204,

  // Redirection
  MovedPermanently = 301,
  Found = 302,
  TemporaryRedirect = 307,

  // Client Error
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,

  // Server Error
  InternalServerError = 500,
  BadGateway = 502,
}

export const generateRefreshAndJwtToken = (username: string) => {
  const time = 1200; // 1h
  // const time = 3600; // 1h
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: `${time}s`,
  });

  const refreshToken = jwt.sign({ username }, process.env.REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken: token, refreshToken, time };
};

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  custom_event: (args: any) => void;
  create_project: (args: any) => void;
  update_project: (arg: any) => void;
  delete_project: (projectId: string) => void;
  update_kanban: (arg: any) => void;
}

export interface ClientToServerEvents {
  custom_event: (args: any) => void;
  create_project: (args: any) => void;
  update_project: (arg: any) => void;
  delete_project: (projectId: string) => void;
  update_kanban: (arg: any) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
