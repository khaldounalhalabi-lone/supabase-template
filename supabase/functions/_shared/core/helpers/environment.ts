export function isDevelopment(): boolean {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const denoEnv = Deno.env.get("DENO_ENV");
  return (
    supabaseUrl.includes("localhost") ||
    supabaseUrl.includes("127.0.0.1") ||
    denoEnv === "development" ||
    denoEnv === "dev"
  );
}

