import RouteMethods from "./enums/RouteMethods.ts";
import { MiddlewareName } from "../../middlewares/Kernel.ts";

class Route {
  private readonly _url: string;
  private readonly _handler: CallableFunction;
  private readonly _middlewareNames: string[];
  private readonly _excludedMiddlewareNames: MiddlewareName[];
  private readonly _method: RouteMethods;

  constructor(
    url: string,
    handler: CallableFunction,
    middlewareNames: string[],
    excludedMiddlewareNames: string[],
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

  get handler(): CallableFunction {
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
