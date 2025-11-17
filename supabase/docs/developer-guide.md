# Developer Guide: Implementing Edge Functions

This guide explains how to use the edge functions framework to implement your own Supabase Edge Functions.

## Quick Start

### 1. Create Edge Function Directory

Create a new directory for your edge function:

```bash
mkdir supabase/functions/your-function-name
```

### 2. Create Entry Point

Create `index.ts` in your function directory:

```typescript
import { createApp } from "@/shared/bootstrap.ts";
import YourController from "@/shared/controllers/YourController.ts";

createApp((Router) => {
  Router.get("/your-route", [YourController, "methodName"], ["middleware-name"]);
});
```

### 3. Create Deno Configuration

Create `deno.json` in your function directory:

```json
{
  "importMap": "../import_map.json"
}
```

### 4. Register Function in Config

Add your function to `supabase/config.toml`:

```toml
[functions.your-function-name]
enabled = true
verify_jwt = false
import_map = "./functions/your-function-name/deno.json"
entrypoint = "./functions/your-function-name/index.ts"
```

## Creating Controllers

### Controller Structure

Controllers are classes that extend the base `Controller` class:

```typescript
import { Context } from "hono";
import Controller from "@/shared/core/controllers/contracts/Controller.ts";
import { ApiResponse } from "@/shared/modules/response/ApiResponse.ts";
import { trans } from "@/shared/modules/localization/Helpers.ts";

class YourController extends Controller {
  public async index(c: Context): Promise<Response> {
    // Your logic here
    const data = { message: "Hello World" };
    
    return ApiResponse.create()
      .data(data)
      .ok()
      .getSuccess()
      .send();
  }
  
  public show(c: Context): Response {
    const id = c.req.param("id");
    
    if (!id) {
      return ApiResponse.create()
        .message("ID is required")
        .notFound()
        .send();
    }
    
    return ApiResponse.create()
      .data({ id })
      .ok()
      .getSuccess()
      .send();
  }
}

export default YourController;
```

### Controller Best Practices

1. **Public Methods**: Only public methods can be used as route handlers
2. **Context Parameter**: Always accept `Context` as the first parameter
3. **Return Type**: Return `Response` or `Promise<Response>`
4. **Use ApiResponse**: Always use `ApiResponse` for consistent responses
5. **Localization**: Use `trans()` for user-facing messages

## Defining Routes

### Route Methods

The `RouterRegistry` provides methods for all HTTP verbs:

```typescript
createApp((Router) => {
  // GET request
  Router.get("/users", [UserController, "index"]);
  
  // POST request
  Router.post("/users", [UserController, "create"], ["auth"]);
  
  // PUT request
  Router.put("/users/:id", [UserController, "update"], ["auth"]);
  
  // DELETE request
  Router.delete("/users/:id", [UserController, "destroy"], ["auth"]);
});
```

### Route Parameters

Access route parameters via Hono context:

```typescript
public show(c: Context): Response {
  const id = c.req.param("id");        // Route parameter
  const query = c.req.query("filter"); // Query parameter
  const header = c.req.header("Authorization"); // Header
  
  // ...
}
```

### Request Body

Access request body:

```typescript
public async create(c: Context): Promise<Response> {
  const body = await c.req.json();
  
  // Validate and process body
  // ...
}
```

### Middleware Configuration

Apply middlewares to routes:

```typescript
createApp((Router) => {
  // Apply specific middlewares
  Router.get("/protected", [Controller, "method"], ["auth"]);
  
  // Apply multiple middlewares
  Router.post("/data", [Controller, "method"], ["auth", "validation"]);
  
  // Exclude global middlewares
  Router.get("/public", [Controller, "method"], [], ["accept-language"]);
});
```

## Using ApiResponse

### Basic Usage

```typescript
import { ApiResponse } from "@/shared/modules/response/ApiResponse.ts";

// Create response
const response = ApiResponse.create()
  .data({ id: 1, name: "John" })
  .ok()
  .getSuccess()
  .send();
```

### Status Helpers

```typescript
// Success responses
ApiResponse.create().ok().getSuccess().send();
ApiResponse.create().ok().storeSuccess().send();
ApiResponse.create().ok().updateSuccess().send();
ApiResponse.create().ok().deleteSuccess().send();

// Error responses
ApiResponse.create().badRequest().message("Invalid input").send();
ApiResponse.create().notFound().message("Resource not found").send();
ApiResponse.create().notAuthorized().message("Unauthorized").send();
ApiResponse.create().forbidden().message("Forbidden").send();
ApiResponse.create().validationError().message("Validation failed").send();
```

### Custom Status Code

```typescript
ApiResponse.create()
  .code(201)
  .data(createdResource)
  .message("Created successfully")
  .send();
```

### Response Helpers

```typescript
// Convenience methods
ApiResponse.create().getSuccessfully(data).send();
ApiResponse.create().createdSuccessfully(data).send();
ApiResponse.create().updatedSuccessfully(data).send();
ApiResponse.create().deleteSuccessfully().send();
```

## Error Handling

### Throwing Errors

Use custom error classes:

```typescript
import { 
  ValidationError, 
  NotFoundError, 
  UnauthorizedError,
  InternalServerError 
} from "@/shared/core/errors/AppError.ts";

// Validation error
if (!isValid) {
  throw new ValidationError("Invalid input data", "VALIDATION_FAILED");
}

// Not found
if (!resource) {
  throw new NotFoundError("Resource not found");
}

// Unauthorized
if (!isAuthorized) {
  throw new UnauthorizedError("You are not authorized");
}

// Internal server error
if (error) {
  throw new InternalServerError("Something went wrong");
}
```

### Using Hono HTTPException

```typescript
import { HTTPException } from "hono/http-exception";

throw new HTTPException(418, { message: "I'm a teapot" });
```

### Error Response Format

Errors are automatically handled and formatted:

**Development Mode:**
```json
{
  "data": null,
  "message": "Validation error",
  "code": 400,
  "error": {
    "name": "ValidationError",
    "message": "Invalid input data",
    "stack": "...",
    "type": "AppError",
    "statusCode": 400,
    "code": "VALIDATION_FAILED"
  }
}
```

**Production Mode:**
```json
{
  "data": null,
  "message": "Validation error",
  "code": 400,
  "error": "UNKNOWN ERROR"
}
```

## Localization

### Using Translations

```typescript
import { trans } from "@/shared/modules/localization/Helpers.ts";

// Use translation key
const message = trans("success");
const errorMessage = trans("error_validation");

// With specific locale
const message = trans("success", "de");
```

### Available Translation Keys

Check `supabase/functions/_shared/modules/localization/messages/en.json` for available keys.

### Adding New Translations

1. Add key to `en.json`:
```json
{
  "your_key": "Your message"
}
```

2. Add translation to `de.json`:
```json
{
  "your_key": "Ihre Nachricht"
}
```

3. Use in code:
```typescript
trans("your_key")
```

## Working with Supabase

### Using Supabase Clients

```typescript
import { supabaseClient, supabaseAdmin } from "@/shared/modules/supabase/client.ts";

// User-scoped client (uses request auth)
const { data, error } = await supabaseClient
  .from("table")
  .select("*");

// Admin client (bypasses RLS)
const { data, error } = await supabaseAdmin
  .from("table")
  .select("*");
```

### Example: Fetching Data

```typescript
public async index(c: Context): Promise<Response> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*");
  
  if (error) {
    throw new InternalServerError("Failed to fetch products");
  }
  
  if (!data || data.length === 0) {
    return ApiResponse.create()
      .noData()
      .send();
  }
  
  return ApiResponse.create()
    .data(data)
    .ok()
    .getSuccess()
    .send();
}
```

## Creating Middlewares

### Middleware Structure

```typescript
import type Middleware from "@/shared/core/middlewares/contracts/Middleware.ts";
import type { Context, Next } from "hono";

class YourMiddleware implements Middleware {
  async handle(c: Context, next: Next): Promise<Response | void> {
    // Pre-processing
    const token = c.req.header("Authorization");
    
    if (!token) {
      return ApiResponse.create()
        .notAuthorized()
        .message("Authorization required")
        .send();
    }
    
    // Continue to next middleware/handler
    return await next();
  }
}

export default YourMiddleware;
```

### Registering Middlewares

Add to `supabase/functions/_shared/bootstrap.ts`:

```typescript
export const APP_MIDDLEWARES = {
  "accept-language": AcceptLanguageMiddleware,
  "auth": AuthMiddleware,
  "your-middleware": YourMiddleware, // Add here
} as const;
```

### Using Middlewares

```typescript
createApp((Router) => {
  Router.get("/protected", [Controller, "method"], ["your-middleware"]);
});
```

## Complete Example

Here's a complete example of an edge function:

### 1. Controller (`_shared/controllers/ProductController.ts`)

```typescript
import { Context } from "hono";
import Controller from "@/shared/core/controllers/contracts/Controller.ts";
import { ApiResponse } from "@/shared/modules/response/ApiResponse.ts";
import { NotFoundError, ValidationError } from "@/shared/core/errors/AppError.ts";
import { supabaseAdmin } from "@/shared/modules/supabase/client.ts";
import { trans } from "@/shared/modules/localization/Helpers.ts";

class ProductController extends Controller {
  public async index(c: Context): Promise<Response> {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*");
    
    if (error) {
      throw new InternalServerError("Failed to fetch products");
    }
    
    if (!data || data.length === 0) {
      return ApiResponse.create().noData().send();
    }
    
    return ApiResponse.create()
      .data(data)
      .ok()
      .getSuccess()
      .send();
  }
  
  public async show(c: Context): Promise<Response> {
    const id = c.req.param("id");
    
    if (!id) {
      throw new ValidationError("Product ID is required");
    }
    
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error || !data) {
      throw new NotFoundError("Product not found");
    }
    
    return ApiResponse.create()
      .data(data)
      .ok()
      .getSuccess()
      .send();
  }
  
  public async create(c: Context): Promise<Response> {
    const body = await c.req.json();
    
    // Validation
    if (!body.name || !body.price) {
      throw new ValidationError("Name and price are required");
    }
    
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(body)
      .select()
      .single();
    
    if (error) {
      throw new InternalServerError("Failed to create product");
    }
    
    return ApiResponse.create()
      .data(data)
      .code(201)
      .storeSuccess()
      .send();
  }
}

export default ProductController;
```

### 2. Edge Function (`functions/products/index.ts`)

```typescript
import { createApp } from "@/shared/bootstrap.ts";
import ProductController from "@/shared/controllers/ProductController.ts";

createApp((Router) => {
  Router.get("/products", [ProductController, "index"], ["accept-language"]);
  Router.get("/products/:id", [ProductController, "show"], ["accept-language"]);
  Router.post("/products", [ProductController, "create"], ["accept-language", "auth"]);
});
```

### 3. Configuration (`config.toml`)

```toml
[functions.products]
enabled = true
verify_jwt = false
import_map = "./functions/products/deno.json"
entrypoint = "./functions/products/index.ts"
```

## Testing Your Edge Function

### Local Development

```bash
# Start Supabase locally
supabase start

# Test your function
curl http://localhost:54321/functions/v1/products
```

### Using curl

```bash
# GET request
curl http://localhost:54321/functions/v1/products

# POST request
curl -X POST http://localhost:54321/functions/v1/products \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{"name": "Product", "price": 100}'

# With authentication
curl http://localhost:54321/functions/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Best Practices

1. **Use Controllers**: Always use controller classes, not inline handlers
2. **Error Handling**: Throw appropriate error types, don't return error responses manually
3. **Localization**: Use `trans()` for all user-facing messages
4. **ApiResponse**: Always use `ApiResponse` or `rest()` helper function for consistent responses
5. **Type Safety**: Leverage TypeScript types throughout
6. **Middleware**: Use middlewares for cross-cutting concerns
7. **Validation**: Validate input data before processing
8. **Error Messages**: Provide meaningful error messages
9. **Status Codes**: Use appropriate HTTP status codes
10. **Cleanup**: Let the framework handle App lifecycle, don't manage it manually

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure `deno.json` has correct import map path
2. **Type Errors**: Check that controller methods are public
3. **Route Not Found**: Verify route is registered in `createApp` callback
4. **Middleware Not Found**: Ensure middleware is registered in `APP_MIDDLEWARES`
5. **Translation Missing**: Add translation key to message files

### Debugging

- Check console logs for errors
- Use development mode for detailed error information
- Verify route registration order
- Check middleware execution order

