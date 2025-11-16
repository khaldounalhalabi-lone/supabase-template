import { createApp } from "@/shared/bootstrap.ts";
import TestController from "@/shared/controllers/TestController.ts";

createApp((app) => {
  app.router.get("/test", [TestController, "index"], ["accept-language"]);
  app.router.get("/test/:id", [TestController, "show"], ["accept-language"]);
});
