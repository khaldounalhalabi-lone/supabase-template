import { Context } from "hono";

export type PublicMethodNames<T> = {
  [K in keyof T]: T[K] extends (c: Context) => Response | Promise<Response>
    ? K
    : never;
}[keyof T];

