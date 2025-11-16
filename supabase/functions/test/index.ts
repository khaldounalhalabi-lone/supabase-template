import { App } from "@/shared/bootstrap.ts";
import { trans } from "@/shared/modules/localization/Helpers.ts";
import { ApiResponse } from "@/shared/modules/response/ApiResponse.ts";

const app = App.make();

app.router.get(
  "/test",
  () => {
    return ApiResponse.create()
      .data({
        message: trans("get_successfully"),
      })
      .ok()
      .getSuccess()
      .send();
  },
  ["accept-language", "auth"],
);

Deno.serve(app.fetch());
