import { Context } from "hono";
import Controller from "../core/controllers/contracts/Controller.ts";
import { trans } from "../modules/localization/Helpers.ts";
import { ApiResponse } from "../modules/response/ApiResponse.ts";
import { supabaseAdmin } from "../modules/supabase/client.ts";

class TestController extends Controller {
  public async index(c: Context): Promise<Response> {
    const { data } = await supabaseAdmin.from("products").select("*");
    return ApiResponse.create().data(data).ok().getSuccess().send();
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
