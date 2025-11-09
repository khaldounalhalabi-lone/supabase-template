# Development Guide Lines

1. No creating tables from the dashboard, use migrations. creating tables from the dashboard will not create a
   migration file.
2. Edge functions are only created via the command line.
3. always use a deno.json file for each edge function to improve DX.
4. always provide a ./supabase/functions/.env.example file.
5. do not disable RLS unless there is a need for that
6. always paginate queried tables data
7. when the logic goes beyond a simple CRUD, it must be handled within an edge function, even for simple logic, like if
   creating a record causes a push notification, the record creation and the notification sending should be
   handled within the edge function, not in the frontend or divided between the frontend and the edge function
8. Zod validation objects should be available for backend and frontend, so both can get the benefit of them
9. migrations should be created using knex
10. always use absolute version numbers for dependencies in deno.json files no just the major version number. 