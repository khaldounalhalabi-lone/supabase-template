import type Middleware from "@/shared/core/middlewares/contracts/Middleware.ts";
import { HonoFactory } from "../types/hono.types.ts";

/**
 * Adapter to convert our Middleware interface to Hono middleware.
 */
export class MiddlewareAdapter {
  constructor(public honoFactory: HonoFactory) {}

  public createMiddleware(middlewares: Middleware[]) {
    return middlewares.map((middleware) => {
      return this.honoFactory.createMiddleware(async (c, next) => {
        return await middleware.handle(c, next);
      });
    });
  }
}
