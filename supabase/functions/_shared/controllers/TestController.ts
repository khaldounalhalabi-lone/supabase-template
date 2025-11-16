import { Context } from "hono";
import Controller from "../core/controllers/contracts/Controller.ts";
import { trans } from "../modules/localization/Helpers.ts";
import { ApiResponse } from "../modules/response/ApiResponse.ts";

class TestController extends Controller {
  public index(c: Context): Response {
    return ApiResponse.create()
      .data({
        message: "Hello World",
      })
      .ok()
      .getSuccess()
      .send();
  }

  public show(c: Context): Response {
    const id = c.req.param("id");
    if (!id) {
      return ApiResponse.create().message("ID is required").notFound().send();
    }
    return ApiResponse.create()
      .data({
        message: trans("success"),
        id: id,
      })
      .ok()
      .getSuccess()
      .send();
  }
}

export default TestController;
