import Controller from "../core/controllers/contracts/Controller.ts";
import { PublicMethodNames } from "./controllers.types.ts";
import { HonoDefaultHandler } from "./hono.types.ts";

export type RouterArrayHandler = [Controller, PublicMethodNames<Controller>];
export type RouterHandler = RouterArrayHandler | HonoDefaultHandler;
