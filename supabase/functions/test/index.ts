import { App } from "@/shared/bootstrap.ts";
import TestController from "@/shared/controllers/TestController.ts";

const app = App.make();

app.router.get("/test", [TestController, "index"], ["accept-language"]);
app.router.get("/test/:id", [TestController, "show"], ["accept-language"]);

Deno.serve(app.fetch());
