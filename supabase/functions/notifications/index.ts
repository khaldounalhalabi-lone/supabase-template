import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
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
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const action = url.searchParams.get("action") || "send"

    if (method === "POST") {
      const body = await req.json()

      if (action === "send") {
        // Send notification
        const { type, message, user_id } = body

        if (!type || !message) {
          return new Response(
            JSON.stringify({ error: "Type and message are required" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          )
        }

        // In a real application, you would send this to a notification service
        // For demo purposes, we'll just return a success response
        const notification = {
          id: crypto.randomUUID(),
          type,
          message,
          user_id: user_id || null,
          created_at: new Date().toISOString(),
          read: false,
        }

        return new Response(
          JSON.stringify({
            success: true,
            notification,
            message: "Notification sent successfully",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        )
      }

      if (action === "order_created") {
        // Send order creation notification
        const { order_id, total_amount } = body

        if (!order_id) {
          return new Response(
            JSON.stringify({ error: "Order ID is required" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          )
        }

        // Get order details
        const { data: order, error: orderError } = await supabaseClient
          .from("orders")
          .select("user_id, total_amount, status")
          .eq("id", order_id)
          .single()

        if (orderError || !order) {
          return new Response(
            JSON.stringify({ error: "Order not found" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 404,
            }
          )
        }

        const notification = {
          id: crypto.randomUUID(),
          type: "order_created",
          message: `Your order #${order_id.slice(0, 8)} for $${total_amount || order.total_amount} has been created successfully!`,
          user_id: order.user_id,
          order_id,
          created_at: new Date().toISOString(),
        }

        return new Response(
          JSON.stringify({
            success: true,
            notification,
            message: "Order notification sent",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        )
      }
    }

    if (method === "GET") {
      // Get notifications for the current user
      const { data: { user } } = await supabaseClient.auth.getUser()

      if (!user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        )
      }

      // In a real app, you would fetch from a notifications table
      // For demo, return mock data
      return new Response(
        JSON.stringify({
          notifications: [],
          message: "No notifications found",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})

