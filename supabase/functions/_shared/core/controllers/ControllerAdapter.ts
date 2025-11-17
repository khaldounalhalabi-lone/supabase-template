import { ControllerClass } from "../types/controllers.types.ts";
import { HonoFactory } from "../types/hono.types.ts";
import { RouterHandler } from "../types/routes.types.ts";

class ControllerAdapter {
  constructor(public honoFactory: HonoFactory) {}

  public createController<T extends ControllerClass>(handler: RouterHandler<T>) {
    if (Array.isArray(handler)) {
      const [controller, method] = handler;
      return this.honoFactory.createHandlers(async (c) => {
        const controllerInstance = new controller();
        if (method in controllerInstance) {
          const methodFn = Reflect.get(controllerInstance, method);
          if (typeof methodFn === 'function') {
            return await methodFn(c);
          }
        }
        throw new Error(
          `Method ${method} not found in controller ${controller.name}`,
        );
      });
    } else {
      return this.honoFactory.createHandlers((c) => {
        return handler(c);
      });
    }
  }
}

export default ControllerAdapter;
