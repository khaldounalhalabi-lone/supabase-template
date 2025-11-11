import App from "../bootstrap/App.ts";
import Route from "./Route.ts";
import Middleware from "../middlewares/contracts/Middleware.ts";
import RouteMethods from "./RouteMethods.ts";

class RouterRegistry {
  private app: App;
  private static routes: Route[] = [];

  constructor(app: App) {
    this.app = app;
  }

  public static get(
    url: string,
    handler: CallableFunction,
    middlewares: Middleware[] = [],
    excludedMiddlewares: Middleware[] = [],
  ) {
    const route = new Route(
      url,
      handler,
      middlewares,
      excludedMiddlewares,
      RouteMethods.GET,
    );
    this.routes.push(route);
  }

  public static post(
    url: string,
    handler: CallableFunction,
    middlewares: Middleware[] = [],
    excludedMiddlewares: Middleware[] = [],
  ) {
    const route = new Route(
      url,
      handler,
      middlewares,
      excludedMiddlewares,
      RouteMethods.POST,
    );
    this.routes.push(route);
  }

  public static put(
    url: string,
    handler: CallableFunction,
    middlewares: Middleware[] = [],
    excludedMiddlewares: Middleware[] = [],
  ) {
    const route = new Route(
      url,
      handler,
      middlewares,
      excludedMiddlewares,
      RouteMethods.PUT,
    );
    this.routes.push(route);
  }

  public static delete(
    url: string,
    handler: CallableFunction,
    middlewares: Middleware[] = [],
    excludedMiddlewares: Middleware[] = [],
  ) {
    const route = new Route(
      url,
      handler,
      middlewares,
      excludedMiddlewares,
      RouteMethods.DELETE,
    );
    this.routes.push(route);
  }

  get routes(): Route[] {
    return RouterRegistry.routes;
  }
}

export default RouterRegistry;
