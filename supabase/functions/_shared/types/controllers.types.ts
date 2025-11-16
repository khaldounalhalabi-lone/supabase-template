import Controller from "../core/controllers/contracts/Controller.ts";

export type ControllerClassType = new () => Controller;
export type PublicMethodNames<T> = {
  [K in keyof T]: T[K] extends CallableFunction ? K : never;
}[keyof T] &
  string;

export type ControllerCtor<T extends Controller = Controller> = new (
  ...args: any[]
) => T;
