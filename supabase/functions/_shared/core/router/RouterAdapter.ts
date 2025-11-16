import { MiddlewareHandler } from "hono/types";
import App from "../bootstrap/App.ts";
import { MiddlewareAdapter } from "../middlewares/MiddlewareAdapter.ts";
import MiddlewareRegistry from "../middlewares/MiddlewareRegistry.ts";
import RouteMethods from "./enums/RouteMethods.ts";
import Route from "./Route.ts";

class RouterAdapter {
  constructor(
    public middlewareRegistry: MiddlewareRegistry,
    public middlewareAdapter: MiddlewareAdapter,
  ) {}

  public registerRoutes(routes: Route[]): void {
    const app = App.make();

    for (const route of routes) {
      const routeExclusions = [...route.excludedMiddlewareNames];
      const globalMiddlewares =
        this.middlewareRegistry.getGlobalMiddlewares(routeExclusions);

      const routeMiddlewares = this.middlewareRegistry.getMiddlewares(
        route.middlewareNames,
      );

      const allMiddlewares = [...globalMiddlewares, ...routeMiddlewares];

      const handler = route.handler as MiddlewareHandler;

      if (allMiddlewares.length > 0) {
        const middlewaresCallbacks =
          this.middlewareAdapter.createMiddleware(allMiddlewares);

        switch (route.method) {
          case RouteMethods.GET:
            app.honoApp.get(route.url, ...middlewaresCallbacks, handler);
            break;
          case RouteMethods.POST:
            app.honoApp.post(route.url, ...middlewaresCallbacks, handler);
            break;
          case RouteMethods.PUT:
            app.honoApp.put(route.url, ...middlewaresCallbacks, handler);
            break;
          case RouteMethods.DELETE:
            app.honoApp.delete(route.url, ...middlewaresCallbacks, handler);
            break;
        }
      } else {
        switch (route.method) {
          case RouteMethods.GET:
            app.honoApp.get(route.url, handler);
            break;
          case RouteMethods.POST:
            app.honoApp.post(route.url, handler);
            break;
          case RouteMethods.PUT:
            app.honoApp.put(route.url, handler);
            break;
          case RouteMethods.DELETE:
            app.honoApp.delete(route.url, handler);
            break;
        }
      }
    }
  }
}

export default RouterAdapter;
