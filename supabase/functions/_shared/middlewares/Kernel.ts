import AcceptLanguageMiddleware from "./AcceptLanguageMiddleware.ts";
import AuthMiddleware from "./AuthMiddleware.ts";

export type MiddlewareName = (keyof typeof APP_MIDDLEWARES)[];

export const APP_MIDDLEWARES = {
  "accept-language": AcceptLanguageMiddleware,
  auth: AuthMiddleware,
} as const;

export const GLOBAL_MIDDLEWARES: MiddlewareName = [
 "accept-language"
];
