import { HonoDefaultHandler, HonoFactory } from "../../types/hono.types.ts";
import { RouterHandler } from "../../types/routes.types.ts";

class ControllerAdapter {
  constructor(public honoFactory: HonoFactory) {}

  public createController(handler: RouterHandler) {
    if (Array.isArray(handler)) {
      const [controller, method] = handler;
      return this.honoFactory.createHandlers(async (c) => {
        return await (controller[method] as HonoDefaultHandler)(c);
      });
    } else {
      return this.honoFactory.createHandlers(async (c) => {
        return await handler(c);
      });
    }
  }
}

export default ControllerAdapter;
