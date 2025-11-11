import { Hono } from "hono";
import MiddlewareRegistry from "@/shared/core/middlewares/MiddlewareRegistry.ts";
import RouterRegistry from "@/shared/core/router/RouterRegistry.ts";
import RouteMethods from "@/shared/core/router/enums/RouteMethods.ts";
import { MiddlewareAdapter } from "@/shared/core/middlewares/MiddlewareAdapter.ts";
import { APP_MIDDLEWARES, GLOBAL_MIDDLEWARES } from "@/shared/bootstrap.ts";

/**
 * Application class for managing routes and middleware.
 * Similar to Laravel's Router, provides a clean API for route definitions.
 * Designed to support controllers in the future.
 */
class App {
  private honoApp: Hono;
  private middlewareRegistry: MiddlewareRegistry;
  private exclude: string[];

  /**
   * Create a new App instance.
   *
   * @param options - Configuration options
   * @param options.exclude - Array of middleware identifiers to exclude from global middleware
   */
  constructor(options?: { exclude?: string[] }) {
    this.honoApp = new Hono();
    this.middlewareRegistry = new MiddlewareRegistry();
    this.exclude = options?.exclude || [];

    // Initialize middleware registry from Kernel config
    this.initializeMiddlewareRegistry();

    // Register routes from RouterRegistry
    // Global middleware are applied per-route to support per-route exclusions
    this.registerRoutes();
  }

  /**
   * Initialize middleware registry from Kernel configuration.
   */
  private initializeMiddlewareRegistry(): void {
    // Register all middleware classes
    for (
      const [identifier, MiddlewareClass] of Object.entries(
        APP_MIDDLEWARES,
      )
    ) {
      this.middlewareRegistry.registerMiddlewareClass(
        identifier,
        MiddlewareClass,
      );
    }

    // Register global middleware
    for (const identifier of GLOBAL_MIDDLEWARES) {
      this.middlewareRegistry.registerGlobalMiddleware(identifier);
    }
  }

  /**
   * Register routes from RouterRegistry to Hono app.
   * Global middleware is applied per-route to support per-route exclusions.
   */
  private registerRoutes(): void {
    const routes = RouterRegistry.getRoutes();

    for (const route of routes) {
      // Get global middlewares, excluding:
      // 1. App-level exclusions (from constructor)
      // 2. Route-specific exclusions
      const routeExclusions = [
        ...this.exclude,
        ...route.excludedMiddlewareNames,
      ];
      const globalMiddlewares = this.middlewareRegistry.getGlobalMiddlewares(
        routeExclusions,
      );

      // Get route-specific middlewares
      const routeMiddlewares = this.middlewareRegistry.getMiddlewares(
        route.middlewareNames,
      );

      // Combine: global (with exclusions) + route-specific
      const allMiddlewares = [...globalMiddlewares, ...routeMiddlewares];

      // Register route with Hono based on method
      if (allMiddlewares.length > 0) {
        const middlewareFn = MiddlewareAdapter.createMiddleware(allMiddlewares);

        switch (route.method) {
          case RouteMethods.GET:
            this.honoApp.get(route.url, middlewareFn, route.handler);
            break;
          case RouteMethods.POST:
            this.honoApp.post(route.url, middlewareFn, route.handler);
            break;
          case RouteMethods.PUT:
            this.honoApp.put(route.url, middlewareFn, route.handler);
            break;
          case RouteMethods.DELETE:
            this.honoApp.delete(route.url, middlewareFn, route.handler);
            break;
        }
      } else {
        // No middleware, just register the handler
        switch (route.method) {
          case RouteMethods.GET:
            this.honoApp.get(route.url, route.handler);
            break;
          case RouteMethods.POST:
            this.honoApp.post(route.url, route.handler);
            break;
          case RouteMethods.PUT:
            this.honoApp.put(route.url, route.handler);
            break;
          case RouteMethods.DELETE:
            this.honoApp.delete(route.url, route.handler);
            break;
        }
      }
    }
  }

  /**
   * Get the underlying Hono app instance.
   * Useful for advanced use cases or when you need direct access to Hono features.
   */
  getHonoApp(): Hono {
    return this.honoApp;
  }

  /**
   * Get the fetch handler for Deno.serve.
   */
  fetch() {
    return this.honoApp.fetch;
  }
}

export default App;
