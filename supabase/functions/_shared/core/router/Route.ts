import Middleware from "../middlewares/contracts/Middleware.ts";
import RouteMethods from "./enums/RouteMethods.ts";

class Route {
  private readonly _url: string;
  private readonly _handler: CallableFunction;
  private readonly _middlewares: Middleware[];
  private readonly _excludedMiddlewares: Middleware[];
  private readonly _method: RouteMethods;

  constructor(
    url: string,
    handler: CallableFunction,
    middlewares: Middleware[],
    excludedMiddlewares: Middleware[],
    method: RouteMethods,
  ) {
    this._url = url;
    this._handler = handler;
    this._middlewares = middlewares;
    this._excludedMiddlewares = excludedMiddlewares;
    this._method = method;
  }

  get url(): string {
    return this._url;
  }

  get handler(): CallableFunction {
    return this._handler;
  }

  get middlewares(): Middleware[] {
    return this._middlewares;
  }

  get excludedMiddlewares(): Middleware[] {
    return this._excludedMiddlewares;
  }

  get method(): RouteMethods {
    return this._method;
  }
}

export default Route;
