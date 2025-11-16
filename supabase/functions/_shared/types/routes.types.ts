import { ControllerCtor, PublicMethodNames } from "./controllers.types.ts";
import { HonoDefaultHandler } from "./hono.types.ts";
export type RouterArrayHandler<Ctor extends ControllerCtor> = [
  ctor: Ctor,
  method: PublicMethodNames<InstanceType<Ctor>>,
];
export type RouterHandler<Controller extends ControllerCtor> =
  | RouterArrayHandler<Controller>
  | HonoDefaultHandler;
