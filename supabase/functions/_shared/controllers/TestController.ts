import { Context } from "hono";
import Controller from "../core/controllers/contracts/Controller.ts";
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
}

export default TestController;
