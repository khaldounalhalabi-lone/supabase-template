import type Middleware from "@/shared/core/middlewares/contracts/Middleware.ts";
import type { MiddlewareHandler } from "hono/types";
import { MiddlewareFactory } from "../bootstrap/App.ts";

/**
 * Adapter to convert our Middleware interface to Hono middleware.
 */
export class MiddlewareAdapter {
  constructor(public honoFactory: MiddlewareFactory) {}

  public createMiddleware(middlewares: Middleware[]): MiddlewareHandler[] {
    const middlewareCallbacks: MiddlewareHandler[] = [];

    middlewares.forEach((middleware) => {
      const callback = this.honoFactory.createMiddleware(async (c, next) => {
        await middleware.handle(c, next);
      });
      middlewareCallbacks.push(callback);
    });

    return middlewareCallbacks;
  }
}
