import { APP_MIDDLEWARES, GLOBAL_MIDDLEWARES } from "@/shared/bootstrap.ts";
import ControllerAdapter from "@/shared/core/controllers/ControllerAdapter.ts";
import { MiddlewareAdapter } from "@/shared/core/middlewares/MiddlewareAdapter.ts";
import MiddlewareRegistry from "@/shared/core/middlewares/MiddlewareRegistry.ts";
import RouterRegistry from "@/shared/core/router/RouterRegistry.ts";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import Locale from "../../modules/localization/Locale.ts";
import RouterAdapter from "../router/RouterAdapter.ts";
import { HonoFactory } from "../types/hono.types.ts";
import { ErrorHandler } from "../errors/ErrorHandler.ts";

class App {
  private static instance: App | null = null;
  public readonly honoApp: Hono;
  private middlewareRegistry: MiddlewareRegistry;
  private routeRegistry: RouterRegistry;
  private honoFactory: HonoFactory;
  private middlewareAdapter: MiddlewareAdapter;
  private controllerAdapter: ControllerAdapter;
  private routerAdapter: RouterAdapter;
  private _locale: Locale;

  private constructor() {
    this.honoFactory = createFactory();
    this.honoApp = this.honoFactory.createApp();
    this.middlewareRegistry = new MiddlewareRegistry();
    this.routeRegistry = new RouterRegistry();
    this.middlewareAdapter = new MiddlewareAdapter(this.honoFactory);
    this.controllerAdapter = new ControllerAdapter(this.honoFactory);
    this.routerAdapter = new RouterAdapter(
      this.middlewareRegistry,
      this.middlewareAdapter,
      this.controllerAdapter,
    );

    this._locale = new Locale();
  }

  public static make(): App {
    if (!this.instance) {
      this.instance = new App();
      this.instance.register();
    }
    return this.instance;
  }

  public static destroy(): void {
    this.instance = null;
  }

  private register(): void {
    this.initializeMiddlewareRegistry();
    this.setupErrorHandler();
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

  private setupErrorHandler(): void {
    const errorHandler = new ErrorHandler();
    this.honoApp.onError((error, context) => {
      return errorHandler.handle(error, context);
    });
  }

  private boot(): void {
    const routes = this.routeRegistry.getRoutes();
    this.routerAdapter.registerRoutes(routes);
  }

  public get router() {
    return this.routeRegistry;
  }

  public get locale() {
    return this._locale;
  }

  fetch() {
    this.boot();
    return this.honoApp.fetch;
  }
}

export default App;
