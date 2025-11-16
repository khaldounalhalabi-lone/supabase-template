import { Context } from "hono";
import { createFactory } from "hono/factory";

export type HonoFactory = ReturnType<typeof createFactory>;

export type HonoDefaultHandler = (c: Context) => Response | Promise<Response>;
