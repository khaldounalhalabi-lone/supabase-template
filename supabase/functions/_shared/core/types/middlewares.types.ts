import Middleware from "../middlewares/contracts/Middleware.ts";

/**
 * Represents a constructor function that creates a Middleware instance.
 * This type enforces that middleware classes must be instantiable without arguments.
 *
 * @returns A constructor function that creates an instance of Middleware
 *
 * @example
 * ```typescript
 * class AuthMiddleware implements Middleware {
 *   async handle(c: Context, next: Next) {
 *     // middleware logic
 *   }
 * }
 * const MiddlewareClass: MiddlewareClassType = AuthMiddleware;
 * ```
 */
export type MiddlewareClassType = new () => Middleware;

