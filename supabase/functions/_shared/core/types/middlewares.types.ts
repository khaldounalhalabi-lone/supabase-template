import Middleware from "../middlewares/contracts/Middleware.ts";

export type MiddlewareClassType = new (...args: never[]) => Middleware;

