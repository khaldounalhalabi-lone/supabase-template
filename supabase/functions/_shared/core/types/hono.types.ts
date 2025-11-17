import { Context } from "hono";
import { createFactory } from "hono/factory";

/**
 * Represents the Hono factory type returned by `createFactory()` from hono/factory.
 * This factory provides methods to create Hono apps, handlers, and middlewares
 * with type safety and dependency injection support.
 *
 * @see https://hono.dev/docs/api/factory
 *
 * @example
 * ```typescript
 * import { createFactory } from "hono/factory";
 * const factory: HonoFactory = createFactory();
 * const app = factory.createApp();
 * ```
 */
export type HonoFactory = ReturnType<typeof createFactory>;

/**
 * Represents a standard Hono route handler function.
 * This type defines the signature for handlers that process HTTP requests
 * and return a Response, either synchronously or asynchronously.
 *
 * @param c - The Hono Context object containing request and response utilities
 * @returns A Response object or a Promise that resolves to a Response
 *
 * @example
 * ```typescript
 * const handler: HonoDefaultHandler = async (c) => {
 *   return c.json({ message: "Hello" });
 * };
 * ```
 */
export type HonoDefaultHandler = (c: Context) => Response | Promise<Response>;

