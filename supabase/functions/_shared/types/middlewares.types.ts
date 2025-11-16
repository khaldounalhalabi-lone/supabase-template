import Middleware from "../core/middlewares/contracts/Middleware.ts";

export type MiddlewareClassType = new (...args: never[]) => Middleware;
