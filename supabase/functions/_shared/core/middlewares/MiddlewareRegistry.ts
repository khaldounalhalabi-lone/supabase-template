import Middleware from "./contracts/Middleware.ts";

class MiddlewareRegistry {
  private registeredMiddlewares: Map<string, Middleware> = new Map();
  private globalMiddlewares: string[] = [];

  constructor() {}

  public registerMiddleware(identifier: string, middleware: Middleware) {
    this.registeredMiddlewares.set(identifier, middleware);
  }

  public getRegisteredMiddlewares() {
    return this.registeredMiddlewares;
  }

  public getGlobalMiddlewares() {
    return this.globalMiddlewares;
  }
}

export default MiddlewareRegistry;
