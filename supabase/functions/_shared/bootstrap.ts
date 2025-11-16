import AcceptLanguageMiddleware from "@/shared/middlewares/AcceptLanguageMiddleware.ts";
import AuthMiddleware from "@/shared/middlewares/AuthMiddleware.ts";
import App from "./core/bootstrap/App.ts";
export type MiddlewareName = keyof typeof APP_MIDDLEWARES;

/** Middlewares */
// Register here all of your application middlewares
export const APP_MIDDLEWARES = {
  "accept-language": AcceptLanguageMiddleware,
  auth: AuthMiddleware,
} as const;

// Globally applied middlewares
export const GLOBAL_MIDDLEWARES: MiddlewareName[] = ["accept-language"];

/** Localization */
export const APP_LOCALES = ["en", "de"];

export const DEFAULT_LOCALE = "en";

export function createApp(appCallback: (app: App) => void) {
  const app = App.make();
  appCallback(app);
  Deno.serve(app.fetch());
}
