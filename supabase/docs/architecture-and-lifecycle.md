# Edge Functions Architecture and Lifecycle

This document describes the architecture, structure, and lifecycle of the edge functions framework.

## Overview

The edge functions framework provides a structured, scalable approach to building Supabase Edge Functions using TypeScript, Hono, and a custom application architecture. It follows a controller-based pattern with middleware support, error handling, localization, and standardized API responses.

## Directory Structure

```
supabase/functions/
├── _shared/                    # Shared code used across all edge functions
│   ├── bootstrap.ts           # Application bootstrap and configuration
│   ├── controllers/           # Application controllers
│   │   └── TestController.ts
│   ├── core/                  # Core framework components
│   │   ├── bootstrap/
│   │   │   └── App.ts         # Main App singleton class
│   │   ├── controllers/       # Controller adapters and contracts
│   │   ├── errors/            # Error handling system
│   │   ├── helpers/           # Utility functions
│   │   ├── middlewares/       # Middleware system
│   │   ├── router/            # Routing system
│   │   └── types/             # TypeScript type definitions
│   ├── middlewares/           # Application middlewares
│   │   ├── AcceptLanguageMiddleware.ts
│   │   └── AuthMiddleware.ts
│   └── modules/               # Feature modules
│       ├── localization/     # i18n support
│       ├── response/          # API response utilities
│       └── supabase/          # Supabase client utilities
├── test/                      # Example edge function
│   ├── index.ts              # Edge function entry point
│   └── deno.json             # Deno configuration
└── import_map.json            # Import path mappings
```

## Core Components

### 1. App Class (`core/bootstrap/App.ts`)

The `App` class is a singleton that serves as the central orchestrator of the application. It manages:

- **Hono Application**: The underlying Hono framework instance
- **Middleware Registry**: Registration and management of middlewares
- **Route Registry**: Collection of application routes
- **Error Handler**: Global error handling via Hono's `onError` hook
- **Localization**: Locale management for i18n support
- **Adapters**: Controllers, middlewares, and router adapters

#### Singleton Pattern

The App uses a singleton pattern to ensure only one instance exists per request:

```typescript
App.make()    // Creates or returns existing instance
App.destroy() // Cleans up instance after request
```

### 2. Bootstrap (`bootstrap.ts`)

The bootstrap file provides:

- **Middleware Registration**: `APP_MIDDLEWARES` object mapping middleware names to classes
- **Global Middlewares**: `GLOBAL_MIDDLEWARES` array of middlewares applied to all routes
- **Localization Configuration**: `APP_LOCALES` and `DEFAULT_LOCALE`
- **createApp Function**: Entry point for edge functions

### 3. Router System

The routing system consists of:

- **RouterRegistry**: Collects routes during initialization
- **RouterAdapter**: Adapts routes to Hono's routing system
- **Route**: Represents a single route with URL, handler, and middleware configuration

### 4. Controller System

Controllers follow a class-based pattern:

- **Controller Contract**: Base interface all controllers must implement
- **ControllerAdapter**: Converts controller classes to Hono handlers
- **Method Resolution**: Uses reflection to call controller methods

### 5. Middleware System

Middlewares are classes that implement the `Middleware` interface:

- **MiddlewareRegistry**: Manages middleware registration and retrieval
- **MiddlewareAdapter**: Converts middleware classes to Hono middleware
- **Global vs Route-specific**: Middlewares can be global or route-specific

### 6. Error Handling

The error handling system provides:

- **AppError Classes**: Custom error types (ValidationError, NotFoundError, etc.)
- **ErrorHandler**: Global error handler that formats errors consistently
- **Development Mode**: Detailed error information in development
- **Production Mode**: Generic error messages in production

### 7. Response System

Standardized API responses via `ApiResponse` class:

- **Fluent API**: Chainable methods for building responses
- **Status Helpers**: Convenient methods for common HTTP status codes
- **Localization**: Automatic message localization
- **Error Field**: Optional error information in development mode

## Application Lifecycle

### 1. Request Initialization

When a request arrives at an edge function:

```typescript
Deno.serve(async (req) => {
  // 1. Create App instance (singleton)
  const app = App.make();
  
  // 2. Register routes via callback
  appCallback(app.router);
  
  // 3. Boot the application (register routes with Hono)
  const fetch = app.fetch();
  
  // 4. Process request
  const res = await fetch(req);
  
  // 5. Cleanup
  App.destroy();
  
  return res;
});
```

### 2. App Creation (`App.make()`)

When `App.make()` is called:

1. **Check Singleton**: If instance exists, return it
2. **Create Instance**: Instantiate App class
3. **Register**: Call `register()` method which:
   - Initializes middleware registry
   - Sets up error handler

### 3. Route Registration (`appCallback(app.router)`)

During route registration:

1. **RouterRegistry**: Routes are collected in `RouterRegistry`
2. **Route Definition**: Each route specifies:
   - URL pattern
   - Handler (controller method or function)
   - Middleware names (optional)
   - Excluded middleware names (optional)

### 4. Boot Phase (`app.fetch()`)

When `app.fetch()` is called:

1. **Boot**: Calls `boot()` method
2. **Route Registration**: `RouterAdapter` registers all routes with Hono
3. **Middleware Application**: Middlewares are applied in order:
   - Global middlewares (first)
   - Route-specific middlewares (second)
4. **Handler Execution**: Controller methods or handlers are executed

### 5. Request Processing

During request processing:

1. **Middleware Chain**: Request passes through middleware chain
2. **Controller Execution**: Controller method is called with Hono context
3. **Response Generation**: Controller returns `ApiResponse` or `Response`
4. **Error Handling**: Any errors are caught by Hono's `onError` hook

### 6. Error Handling Flow

When an error occurs:

1. **Error Thrown**: Error is thrown from controller, middleware, or handler
2. **Hono Catch**: Hono's `onError` hook catches the error
3. **ErrorHandler**: `ErrorHandler.handle()` processes the error:
   - Determines status code
   - Gets localized error message
   - Normalizes status code (200-599 range)
   - Adds debug info in development mode
4. **Response**: Formatted error response is returned

### 7. Cleanup (`App.destroy()`)

After request processing:

1. **Instance Cleanup**: App singleton instance is set to null
2. **Memory Release**: Resources are released for next request

## Request Flow Diagram

```
Request
  ↓
Deno.serve()
  ↓
App.make() → Create/Get Singleton
  ↓
appCallback(app.router) → Register Routes
  ↓
app.fetch() → Boot Application
  ↓
RouterAdapter.registerRoutes() → Register with Hono
  ↓
Request Processing:
  ├─ Global Middlewares
  ├─ Route Middlewares
  ├─ Controller Method
  └─ Response Generation
  ↓
Error? → ErrorHandler.handle()
  ↓
Response
  ↓
App.destroy() → Cleanup
```

## Key Design Patterns

### 1. Singleton Pattern
- **App Class**: Ensures single instance per request
- **Purpose**: Centralized state management

### 2. Registry Pattern
- **MiddlewareRegistry**: Manages middleware registration
- **RouterRegistry**: Manages route registration
- **Purpose**: Decoupled component registration

### 3. Adapter Pattern
- **ControllerAdapter**: Adapts controllers to Hono handlers
- **MiddlewareAdapter**: Adapts middlewares to Hono middleware
- **RouterAdapter**: Adapts routes to Hono routes
- **Purpose**: Bridge between framework and Hono

### 4. Factory Pattern
- **HonoFactory**: Creates Hono apps, handlers, and middlewares
- **Purpose**: Consistent creation of Hono components

### 5. Strategy Pattern
- **Error Handling**: Different error types handled differently
- **Middleware Selection**: Different middlewares for different routes
- **Purpose**: Flexible behavior selection

## Type Safety

The framework leverages TypeScript for type safety:

- **Controller Types**: Type-safe controller method resolution
- **Middleware Types**: Type-safe middleware registration
- **Route Types**: Type-safe route definitions
- **Response Types**: Generic response types for data

## Localization

The framework includes built-in i18n support:

- **Locale Class**: Manages current locale per request
- **Translation Helper**: `trans()` function for localized messages
- **Message Files**: JSON files for each language
- **Accept-Language**: Automatic locale detection from headers

## Environment Detection

The framework detects the environment:

- **Development Mode**: Detected via `SUPABASE_URL` (localhost/127.0.0.1) or `DENO_ENV`
- **Error Details**: Detailed error information in development
- **Security**: Generic error messages in production

## Best Practices

1. **Per-Request Instance**: App instance is created and destroyed per request
2. **Route Registration**: Routes are registered during callback, not stored
3. **Error Handling**: All errors go through centralized error handler
4. **Type Safety**: Leverage TypeScript types throughout
5. **Localization**: Use `trans()` for all user-facing messages
6. **Standardized Responses**: Use `ApiResponse` for consistent API responses

