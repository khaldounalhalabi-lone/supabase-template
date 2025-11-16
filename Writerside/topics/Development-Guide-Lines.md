# Development Guide Lines

1. No creating tables from the dashboard, use migrations. creating tables from the dashboard will not create a
   migration file.
2. Edge functions are only created via the command line.
3. always use a deno.json file for each edge function to improve DX.
4. always provide a ./supabase/functions/.env.example file.
5. do not disable RLS
6. always paginate queried tables data
7. when the logic goes beyond a simple CRUD, it must be handled within an edge function, even for simple logic, like if
   creating a record causes a push notification, the record creation and the notification sending should be
   handled within the edge function, not in the frontend or divided between the frontend and the edge function (to be discussed)
8. Zod validation objects should be available for backend and frontend, so both can get the benefit of them
9. migrations should be created using knex // to be discussed again and researched
10. always use absolute version numbers for dependencies in deno.json files no just the major version number.
11. use localization library inside the edge functions, no hard-coded strings for messages, errors, etc.
12. for each edge function should be a test file. (this needs to be discussed later and find the right solution for the whole project)
13. for each edge function should be a corresponding enum for its name, so the developer can determine its usage or
    update it easily.
14. Edge functions invocations should be centralized (create a simple helper that calls edge functions in a unified way
    instead of using the SDK on every call).
15. no internal edge functions calling (an edge function should not call another edge function within the same
    project).
16. we need to define a strict cursor rule for the code structure
17. Try to avoid the usage of database functions
18. Depend on supabase branches instead of creating new projects for each environment.
19. For email sending, use a template engine (e.g.: eta, Template) or store HTML content in a separate file.