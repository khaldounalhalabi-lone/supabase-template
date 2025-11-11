import type { Hono } from "hono";
import type Middleware from "./contracts/Middleware.ts";

/**
 * Adapter to convert our Middleware interface to Hono middleware.
 */
export class MiddlewareAdapter {
  /**
   * Apply middleware instances to a Hono app or route.
   * 
   * @param app - Hono app instance or route handler
   * @param middlewares - Array of middleware instances to apply
   */
  static apply(app: Hono, middlewares: Middleware[]): void {
    for (const middleware of middlewares) {
      app.use("*", async (c, honoNext) => {
        // Create a wrapper that converts Hono's next() (void) to our next() (Response)
        const next = async (): Promise<Response> => {
          // Call Hono's next() which processes the rest of the chain
          await honoNext();
          // After next() completes, the response is available in c.res
          // Return it so our middleware can use/modify it
          return c.res || new Response(null, { status: 404 });
        };

        // Call our middleware's handle method
        const response = await middleware.handle(c, next);
        
        // If middleware returns a response, use it (early termination or modified response)
        // Otherwise, Hono will use c.res which was set by the handler
        return response || c.res;
      });
    }
  }

  /**
   * Create a Hono middleware function from middleware instances.
   * 
   * @param middlewares - Array of middleware instances
   * @returns Hono middleware function
   */
  static createMiddleware(middlewares: Middleware[]) {
    return async (c: any, next: () => Promise<void>) => {
      let index = 0;
      
      const executeNext = async (): Promise<Response> => {
        if (index >= middlewares.length) {
          await next();
          return c.res || new Response(null, { status: 404 });
        }
        
        const middleware = middlewares[index++];
        return await middleware.handle(c, executeNext);
      };
      
      const response = await executeNext();
      return response || c.res;
    };
  }
}

