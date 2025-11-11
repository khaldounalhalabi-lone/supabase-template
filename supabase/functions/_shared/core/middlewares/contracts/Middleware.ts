import type { Context } from "hono";

/**
 * Middleware contract that all middlewares must implement.
 * Similar to Laravel's middleware interface, adapted for Hono.
 */
interface Middleware {
  /**
   * Handle an incoming request.
   * @param c - Hono context object
   * @param next - Function to call the next middleware/handler in the chain
   * @returns Response or Promise<Response>
   */
  handle(
    c: Context,
    next: () => Promise<Response>,
  ): Promise<Response> | Response;
}

export type MiddlewareClassType = new (...args: never[]) => Middleware;

export default Middleware;
