import { MiddlewareClassType } from "../types/middlewares.types.ts";
import Middleware from "./contracts/Middleware.ts";

class MiddlewareRegistry {
  private middlewareClasses: Map<string, new (...args: never[]) => Middleware> =
    new Map();
  private middlewareInstances: Map<string, Middleware> = new Map();
  private globalMiddlewares: string[] = [];

  constructor() {}

  /**
   * Register a middleware class with an identifier.
   * The middleware will be instantiated lazily when needed.
   */
  public registerMiddlewareClass(
    identifier: string,
    middlewareClass: MiddlewareClassType,
  ): void {
    this.middlewareClasses.set(identifier, middlewareClass);
  }

  /**
   * Get a middleware instance by identifier.
   * If the middleware class is registered but not instantiated, it will be instantiated lazily.
   */
  public getMiddleware(identifier: string): Middleware | undefined {
    if (this.middlewareInstances.has(identifier)) {
      return this.middlewareInstances.get(identifier);
    }

    const MiddlewareClass = this.middlewareClasses.get(identifier);
    if (MiddlewareClass) {
      const instance = new MiddlewareClass();
      this.middlewareInstances.set(identifier, instance);
      return instance;
    }

    return undefined;
  }

  public getMiddlewares(identifiers: string[]): Middleware[] {
    const middlewares: Middleware[] = [];
    for (const identifier of identifiers) {
      const middleware = this.getMiddleware(identifier);
      if (middleware) {
        middlewares.push(middleware);
      } else {
        throw new Error(`Middleware not found: ${identifier}`);
      }
    }
    return middlewares;
  }

  public registerGlobalMiddleware(identifier: string): void {
    if (!this.globalMiddlewares.includes(identifier)) {
      this.globalMiddlewares.push(identifier);
    }
  }

  /**
   * Get global middleware instances.
   * @param exclude - Optional array of middleware identifiers to exclude
   * @returns Array of global middleware instances in registration order
   */
  public getGlobalMiddlewares(exclude: string[] = []): Middleware[] {
    const identifiers = this.globalMiddlewares.filter(
      (id) => !exclude.includes(id),
    );
    return this.getMiddlewares(identifiers);
  }
}

export default MiddlewareRegistry;
