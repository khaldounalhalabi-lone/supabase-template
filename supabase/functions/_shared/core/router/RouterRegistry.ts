import { MiddlewareName } from "@/shared/bootstrap.ts";
import Route from "@/shared/core/router/Route.ts";
import RouteMethods from "@/shared/core/router/enums/RouteMethods.ts";
import { ControllerClass } from "../types/controllers.types.ts";
import { RouterHandler } from "../types/routes.types.ts";

class RouterRegistry {
  private routes: Route<ControllerClass>[] = [];

  constructor() {}

  public get<Controller extends ControllerClass>(
    url: string,
    handler: RouterHandler<Controller>,
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

  public post<Controller extends ControllerClass>(
    url: string,
    handler: RouterHandler<Controller>,
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

  public put<Controller extends ControllerClass>(
    url: string,
    handler: RouterHandler<Controller>,
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

  public delete<Controller extends ControllerClass>(
    url: string,
    handler: RouterHandler<Controller>,
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

  public getRoutes(): Route<ControllerClass>[] {
    return this.routes;
  }
}

export default RouterRegistry;
