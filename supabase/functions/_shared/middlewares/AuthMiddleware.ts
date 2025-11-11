import type { Context } from "hono";
import type Middleware from "../core/middlewares/contracts/Middleware.ts";
import { createClient } from "supabase";
import { ApiResponse } from "../modules/response/ApiResponse.ts";

/**
 * Authentication middleware.
 * Validates the Authorization header and sets the Supabase client and user in context.
 * Stops execution if the user is not authenticated.
 */
class AuthMiddleware implements Middleware {
  async handle(c: Context, next: () => Promise<Response>): Promise<Response> {
    // Get Authorization header
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return ApiResponse.create()
        .notAuthorized()
        .message("Authorization header is required")
        .send();
    }

    try {
      // Create Supabase client with the auth context
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
          global: {
            headers: { Authorization: authHeader },
          },
        }
      );

      // Get the current user
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

      // Store Supabase client and user in context for use in handlers
      c.set("supabase", supabaseClient);
      c.set("user", user);

      // Continue to next middleware/handler
      return await next();
    } catch (error) {
      return ApiResponse.create()
        .unknown()
        .message(error instanceof Error ? error.message : "Authentication failed")
        .send();
    }
  }
}

export default AuthMiddleware;
