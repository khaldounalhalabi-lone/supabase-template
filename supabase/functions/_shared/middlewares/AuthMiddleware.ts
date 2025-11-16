import type Middleware from "@/shared/core/middlewares/contracts/Middleware.ts";
import { ApiResponse } from "@/shared/modules/response/ApiResponse.ts";
import { supabaseClient } from "@/shared/modules/supabase/client.ts";
import type { Context, Next } from "hono";

class AuthMiddleware implements Middleware {
  async handle(c: Context, next: Next): Promise<Response | void> {
    const authHeader = c.req.header("Authorization");
    console.log(authHeader);
    if (!authHeader) {
      return ApiResponse.create()
        .notAuthorized()
        .message("Authorization header is required")
        .send();
    }

    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();

    if (error || !user) {
      return ApiResponse.create()
        .notAuthorized()
        .message("Invalid or expired token")
        .send();
    }

    await next();
  }
}

export default AuthMiddleware;
