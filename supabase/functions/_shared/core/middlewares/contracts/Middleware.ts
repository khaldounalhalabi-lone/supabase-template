import type { Context, Next } from "hono";

/**
 * Middleware contract that all middlewares must implement.
 */
interface Middleware {
  /**
   * Handle an incoming request.
   * @param c - Hono context object
   * @param next - Function to call the next middleware/handler in the chain
   * @returns Response or Promise<Response>
   */
  handle(c: Context, next: Next): Promise<Response | void> | Response;
}

export default Middleware;
