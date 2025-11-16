import { createApp } from "@/shared/bootstrap.ts";
import TestController from "@/shared/controllers/TestController.ts";

createApp((Router) => {
  Router.get("/test", [TestController, "index"], ["accept-language"]);
  Router.get("/test/:id", [TestController, "show"], ["accept-language"]);
});
