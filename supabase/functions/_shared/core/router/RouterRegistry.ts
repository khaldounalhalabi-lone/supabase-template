import Route from "./Route.ts";
import RouteMethods from "./enums/RouteMethods.ts";
import { MiddlewareName } from "../../middlewares/Kernel.ts";

class RouterRegistry {
  private static routes: Route[] = [];

  public static get(
    url: string,
    handler: CallableFunction,
    middlewareNames: MiddlewareName[] = [],
    excludedMiddlewareNames: MiddlewareName[] = [],
  ) {
    const route = new Route(
      url,
      handler,
      middlewareNames,
      excludedMiddlewareNames,
      RouteMethods.GET,
    );
    this.routes.push(route);
  }

  public static post(
    url: string,
    handler: CallableFunction,
    middlewareNames: MiddlewareName[] = [],
    excludedMiddlewareNames: MiddlewareName[] = [],
  ) {
    const route = new Route(
      url,
      handler,
      middlewareNames,
      excludedMiddlewareNames,
      RouteMethods.POST,
    );
    this.routes.push(route);
  }

  public static put(
    url: string,
    handler: CallableFunction,
    middlewareNames: MiddlewareName[] = [],
    excludedMiddlewareNames: MiddlewareName[] = [],
  ) {
    const route = new Route(
      url,
      handler,
      middlewareNames,
      excludedMiddlewareNames,
      RouteMethods.PUT,
    );
    this.routes.push(route);
  }

  public static delete(
    url: string,
    handler: CallableFunction,
    middlewareNames: MiddlewareName[] = [],
    excludedMiddlewareNames: MiddlewareName[] = [],
  ) {
    const route = new Route(
      url,
      handler,
      middlewareNames,
      excludedMiddlewareNames,
      RouteMethods.DELETE,
    );
    this.routes.push(route);
  }

  public static getRoutes(): Route[] {
    return this.routes;
  }
}

export default RouterRegistry;
