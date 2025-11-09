# Development Guide Lines

1. No creating tables from the dashboard, use migrations. creating tables from the dashboard will not create a
   migration file.
2. Edge functions are only created via command line.
3. always use a deno.json file for each edge function to improve DX.
4. always provide a ./supabase/functions/.env.example file.
5. do not disable RLS unless there is a need for that
6. always paginate queried tables data