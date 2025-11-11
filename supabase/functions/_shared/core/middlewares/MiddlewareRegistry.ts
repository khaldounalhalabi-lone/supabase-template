import type Middleware, {
  MiddlewareClassType,
} from "./contracts/Middleware.ts";

class MiddlewareRegistry {
  private middlewareClasses: Map<string, new (...args: any[]) => Middleware> =
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
   * Register a middleware instance with an identifier.
   * @deprecated Use registerMiddlewareClass for lazy initialization
   */
  public registerMiddleware(identifier: string, middleware: Middleware): void {
    this.middlewareInstances.set(identifier, middleware);
  }

  /**
   * Get a middleware instance by identifier.
   * If the middleware class is registered but not instantiated, it will be instantiated lazily.
   */
  public getMiddleware(identifier: string): Middleware | undefined {
    // Check if instance already exists
    if (this.middlewareInstances.has(identifier)) {
      return this.middlewareInstances.get(identifier);
    }

    // Try to instantiate from class
    const MiddlewareClass = this.middlewareClasses.get(identifier);
    if (MiddlewareClass) {
      const instance = new MiddlewareClass();
      this.middlewareInstances.set(identifier, instance);
      return instance;
    }

    return undefined;
  }

  /**
   * Get multiple middleware instances by their identifiers.
   * @param identifiers - Array of middleware identifiers
   * @returns Array of middleware instances
   * @throws Error if any middleware is not found
   */
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

  /**
   * Register middleware to be applied globally to all routes.
   */
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

  public getGlobalMiddlewareIdentifiers(): string[] {
    return [...this.globalMiddlewares];
  }
}

export default MiddlewareRegistry;
