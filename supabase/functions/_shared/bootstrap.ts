/**
 * Bootstrap module - exports the App class for creating applications.
 * 
 * @example
 * ```typescript
 * import App from "@/shared/bootstrap.ts";
 * import RouterRegistry from "@/shared/core/router/RouterRegistry.ts";
 * 
 * // Define routes
 * RouterRegistry.get("/public", async (c) => {
 *   return new Response("Hello");
 * });
 * 
 * RouterRegistry.post("/protected", ["auth"], [], async (c) => {
 *   const user = c.get("user");
 *   return new Response("Protected");
 * });
 * 
 * // Create and serve app
 * const app = new App();
 * Deno.serve(app.fetch());
 * ```
 */
export { default as App } from "./core/bootstrap/App.ts";
export { default as RouterRegistry } from "./core/router/RouterRegistry.ts";

