import { APP_MIDDLEWARES, GLOBAL_MIDDLEWARES } from "@/shared/bootstrap.ts";
import { MiddlewareAdapter } from "@/shared/core/middlewares/MiddlewareAdapter.ts";
import MiddlewareRegistry from "@/shared/core/middlewares/MiddlewareRegistry.ts";
import RouterRegistry from "@/shared/core/router/RouterRegistry.ts";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import RouterAdapter from "../router/RouterAdapter.ts";

export type MiddlewareFactory = ReturnType<typeof createFactory>;

class App {
  public readonly honoApp: Hono;
  private middlewareRegistry: MiddlewareRegistry;
  private routeRegistry: RouterRegistry;
  private honoFactory: MiddlewareFactory;
  private static instance: App | null = null;
  private middlewareAdapter: MiddlewareAdapter;
  private routerAdapter: RouterAdapter;

  private constructor() {
    this.honoApp = new Hono();
    this.middlewareRegistry = new MiddlewareRegistry();
    this.routeRegistry = new RouterRegistry();
    this.honoFactory = createFactory();
    this.middlewareAdapter = new MiddlewareAdapter(this.honoFactory);
    this.routerAdapter = new RouterAdapter(
      this.middlewareRegistry,
      this.middlewareAdapter,
    );

    this.initializeMiddlewareRegistry();
  }

  public static make(): App {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance;
  }

  private initializeMiddlewareRegistry(): void {
    for (const [identifier, MiddlewareClass] of Object.entries(
      APP_MIDDLEWARES,
    )) {
      this.middlewareRegistry.registerMiddlewareClass(
        identifier,
        MiddlewareClass,
      );
    }

    for (const identifier of GLOBAL_MIDDLEWARES) {
      this.middlewareRegistry.registerGlobalMiddleware(identifier);
    }
  }

  private registerRoutes(): void {
    const routes = this.routeRegistry.getRoutes();
    this.routerAdapter.registerRoutes(routes);
  }

  public get router() {
    return this.routeRegistry;
  }

  private wrapItUpp() {
    this.registerRoutes();
  }

  fetch() {
    this.wrapItUpp();
    return this.honoApp.fetch;
  }
}

export default App;
