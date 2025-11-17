import { ControllerClass, PublicMethodNames } from "./controllers.types.ts";
import { HonoDefaultHandler } from "./hono.types.ts";

/**
 * Represents a route handler that uses a controller class and method.
 * This is a tuple type where the first element is the controller constructor
 * and the second element is the name of a public method on that controller.
 *
 * @template Ctor - The controller constructor type
 * @param ctor - The controller class constructor
 * @param method - The name of a public method on the controller instance
 *
 * @example
 * ```typescript
 * class UserController extends Controller {
 *   public index(c: Context) { return new Response(); }
 * }
 * const handler: RouterArrayHandler<typeof UserController> = [
 *   UserController,
 *   "index"
 * ];
 * ```
 */
export type RouterArrayHandler<Ctor extends ControllerClass> = [
  ctor: Ctor,
  method: PublicMethodNames<InstanceType<Ctor>>,
];

/**
 * Represents a route handler that can be either:
 * - A controller-based handler (array with controller class and method name)
 * - A direct Hono handler function
 *
 * This union type allows routes to be defined using either pattern:
 * controller-based routing or direct function handlers.
 *
 * @template Controller - The controller constructor type (only used for array handler)
 *
 * @example
 * ```typescript
 * // Controller-based handler
 * const handler1: RouterHandler<typeof UserController> = [
 *   UserController,
 *   "index"
 * ];
 *
 * // Direct function handler
 * const handler2: RouterHandler<typeof UserController> = (c) => {
 *   return new Response("Hello");
 * };
 * ```
 */
export type RouterHandler<Controller extends ControllerClass> =
  | RouterArrayHandler<Controller>
  | HonoDefaultHandler;

