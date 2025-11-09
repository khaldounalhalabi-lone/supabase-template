import { createClient } from "supabase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "validate";

    if (method === "POST") {
      const body = await req.json();

      if (action === "validate") {
        // Validate product data
        const { name, price, category_id } = body;

        const errors: string[] = [];

        if (!name || name.trim().length === 0) {
          errors.push("Product name is required");
        }

        if (price === undefined || price === null) {
          errors.push("Product price is required");
        } else if (price < 0) {
          errors.push("Product price must be non-negative");
        }

        if (!category_id) {
          errors.push("Category is required");
        } else {
          // Verify category exists
          const { data: category, error: categoryError } = await supabaseClient
            .from("categories")
            .select("id")
            .eq("id", category_id)
            .single();

          if (categoryError || !category) {
            errors.push("Invalid category");
          }
        }

        if (errors.length > 0) {
          return new Response(JSON.stringify({ valid: false, errors }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
        }

        return new Response(
          JSON.stringify({ valid: true, message: "Product data is valid" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }

      if (action === "process") {
        // Process product (e.g., apply discounts, calculate taxes, etc.)
        const { product_id, discount_percent } = body;

        if (!product_id) {
          return new Response(
            JSON.stringify({ error: "Product ID is required" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          );
        }

        // Fetch product
        const { data: product, error: productError } = await supabaseClient
          .from("products")
          .select("*")
          .eq("id", product_id)
          .single();

        if (productError || !product) {
          return new Response(JSON.stringify({ error: "Product not found" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          });
        }

        // Apply discount if provided
        let finalPrice = product.price;
        if (
          discount_percent &&
          discount_percent > 0 &&
          discount_percent <= 100
        ) {
          finalPrice = product.price * (1 - discount_percent / 100);
        }

        // Calculate tax (example: 10% tax)
        const taxRate = 0.1;
        const tax = finalPrice * taxRate;
        const total = finalPrice + tax;

        return new Response(
          JSON.stringify({
            product_id: product.id,
            original_price: product.price,
            discounted_price: finalPrice,
            tax,
            total,
            currency: "USD",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed or invalid action" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
