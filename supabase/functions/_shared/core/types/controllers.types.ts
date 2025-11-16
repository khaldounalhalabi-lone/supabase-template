import Controller from "../controllers/contracts/Controller.ts";

/**
 * Extracts all public method names from a type that are callable functions.
 * This utility type filters out properties that are not functions and returns
 * only the method names as a string union type.
 *
 * @template T - The type to extract method names from
 * @returns A union type of all public method names that are functions
 *
 * @example
 * ```typescript
 * class MyController extends Controller {
 *   public index() {}
 *   public show() {}
 *   private helper() {}
 * }
 * type Methods = PublicMethodNames<MyController>; // "index" | "show"
 * ```
 */
export type PublicMethodNames<T> = {
  [K in keyof T]: T[K] extends CallableFunction ? K : never;
}[keyof T] &
  string;

/**
 * Represents a constructor function for a Controller class.
 * This type allows for controllers that may require constructor arguments.
 *
 * @template T - The specific Controller type that this constructor creates (defaults to Controller)
 * @returns A constructor function that creates an instance of type T
 *
 * @example
 * ```typescript
 * class MyController extends Controller {
 *   constructor(private config: Config) {}
 * }
 * const ctor: ControllerCtor<MyController> = MyController;
 * ```
 */
export type ControllerClass<T extends Controller = Controller> = new () => T;
