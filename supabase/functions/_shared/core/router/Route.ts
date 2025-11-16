import { MiddlewareName } from "@/shared/bootstrap.ts";
import RouteMethods from "@/shared/core/router/enums/RouteMethods.ts";
import { RouterHandler } from "../../types/routes.types.ts";
import { ControllerCtor } from "../../types/controllers.types.ts";

class Route<Controller extends ControllerCtor> {
  private readonly _url: string;
  private readonly _handler: RouterHandler<Controller>;
  private readonly _middlewareNames: MiddlewareName[];
  private readonly _excludedMiddlewareNames: MiddlewareName[];
  private readonly _method: RouteMethods;

  constructor(
    url: string,
    handler: RouterHandler<Controller>,
    middlewareNames: MiddlewareName[],
    excludedMiddlewareNames: MiddlewareName[],
    method: RouteMethods,
  ) {
    this._url = url;
    this._handler = handler;
    this._middlewareNames = middlewareNames;
    this._excludedMiddlewareNames = excludedMiddlewareNames;
    this._method = method;
  }

  get url(): string {
    return this._url;
  }

  get handler(): RouterHandler<Controller> {
    return this._handler;
  }

  get middlewareNames(): MiddlewareName[] {
    return this._middlewareNames;
  }

  get excludedMiddlewareNames(): MiddlewareName[] {
    return this._excludedMiddlewareNames;
  }

  get method(): RouteMethods {
    return this._method;
  }
}

export default Route;
