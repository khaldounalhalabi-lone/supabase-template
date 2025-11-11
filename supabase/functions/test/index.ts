import { ApiResponse } from "@/shared/modules/response/ApiResponse.ts";
import { App, Route } from "@/shared/bootstrap.ts";
import { trans } from "@/shared/modules/localization/Helpers.ts";

Route.get(
  "/test",
  async () => {
    return ApiResponse.create()
      .data({
        message: trans("get_successfully"),
      })
      .ok()
      .getSuccess()
      .send();
  },
  ["accept-language"],
);

const app = new App();
Deno.serve(app.fetch());
