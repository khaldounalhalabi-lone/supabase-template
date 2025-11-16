import Route from "@/shared/core/router/Route.ts";
import RouteMethods from "@/shared/core/router/enums/RouteMethods.ts";
import { MiddlewareName } from "@/shared/bootstrap.ts";

class RouterRegistry {
  private routes: Route[] = [];

  constructor() {}

  public get(
    url: string,
    handler: CallableFunction,
    middlewareNames: MiddlewareName[] = [],
    excludedMiddlewareNames: MiddlewareName[] = [],
  ): void {
    const route = new Route(
      url,
      handler,
      middlewareNames,
      excludedMiddlewareNames,
      RouteMethods.GET,
    );
    this.routes.push(route);
  }

  public post(
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

  public put(
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

  public delete(
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

  public getRoutes(): Route[] {
    return this.routes;
  }
}

export default RouterRegistry;
