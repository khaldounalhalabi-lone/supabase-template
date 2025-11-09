-- Seed data for all tables
-- Note: This assumes you have at least one user in auth.users
-- If not, create test users first or adjust user_ids accordingly

-- First, let's create a helper function to get a test user_id
-- We'll use the first user from auth.users, or create a test user if none exists
DO
$$
DECLARE
test_user_id UUID;
BEGIN
    -- Try to get the first user from auth.users
SELECT id
INTO test_user_id
FROM auth.users LIMIT 1;

-- If no user exists, we'll need to create one via Supabase Auth API
-- For now, we'll use a placeholder that will be replaced during actual seeding
-- In practice, you should create users via Supabase Auth API first
IF
test_user_id IS NULL THEN
        RAISE NOTICE 'No users found in auth.users. Please create at least one user before seeding.';
        RETURN;
END IF;

    -- Insert categories
INSERT INTO public.categories (id, name, description, user_id)
VALUES (gen_random_uuid(), 'Electronics', 'Electronic devices and gadgets', test_user_id),
       (gen_random_uuid(), 'Clothing', 'Apparel and fashion items', test_user_id),
       (gen_random_uuid(), 'Books', 'Books and reading materials', test_user_id),
       (gen_random_uuid(), 'Home & Garden', 'Home improvement and garden supplies', test_user_id),
       (gen_random_uuid(), 'Sports', 'Sports equipment and accessories', test_user_id) ON CONFLICT DO NOTHING;

-- Insert products (we need to get category IDs first)
INSERT INTO public.products (id, name, description, price, category_id, user_id)
SELECT gen_random_uuid(),
       p.name,
       p.description,
       p.price,
       c.id,
       test_user_id
FROM (VALUES ('Laptop', 'High-performance laptop computer', 999.99),
             ('Smartphone', 'Latest model smartphone', 699.99),
             ('Headphones', 'Wireless noise-cancelling headphones', 199.99),
             ('T-Shirt', 'Cotton t-shirt', 19.99),
             ('Jeans', 'Classic blue jeans', 49.99),
             ('Novel', 'Bestselling fiction novel', 14.99),
             ('Textbook', 'Computer science textbook', 89.99),
             ('Garden Tools', 'Complete garden tool set', 79.99),
             ('Plant Seeds', 'Assorted vegetable seeds', 9.99),
             ('Basketball', 'Professional basketball', 24.99),
             ('Running Shoes', 'Comfortable running shoes', 79.99)) AS p(name, description, price)
         CROSS JOIN LATERAL (
    SELECT id
    FROM public.categories
    WHERE name = CASE
                     WHEN p.name IN ('Laptop', 'Smartphone', 'Headphones') THEN 'Electronics'
                     WHEN p.name IN ('T-Shirt', 'Jeans', 'Running Shoes') THEN 'Clothing'
                     WHEN p.name IN ('Novel', 'Textbook') THEN 'Books'
                     WHEN p.name IN ('Garden Tools', 'Plant Seeds') THEN 'Home & Garden'
                     WHEN p.name IN ('Basketball') THEN 'Sports'
        END
        LIMIT 1
    ) AS c
ON CONFLICT DO NOTHING;

-- Insert orders
INSERT INTO public.orders (id, user_id, total_amount, status)
SELECT gen_random_uuid(),
       test_user_id,
       o.total_amount,
       o.status
FROM (VALUES (1049.98, 'pending'),
             (69.98, 'processing'),
             (104.98, 'shipped'),
             (89.99, 'delivered')) AS o(total_amount, status) ON CONFLICT DO NOTHING;

-- Insert order_items (we need to get order and product IDs)
INSERT INTO public.order_items (id, order_id, product_id, quantity, price)
SELECT gen_random_uuid(),
       o.id,
       p.id,
       oi.quantity,
       oi.price
FROM public.orders o
         CROSS JOIN LATERAL (
    SELECT id, price
    FROM public.products
    WHERE name IN ('Laptop', 'Headphones', 'T-Shirt', 'Jeans', 'Novel', 'Textbook')
    ORDER BY RANDOM()
        LIMIT 2
    ) AS p
    CROSS JOIN LATERAL (
SELECT *
FROM (VALUES
    (1, (SELECT price FROM public.products WHERE id = p.id LIMIT 1)), (2, (SELECT price FROM public.products WHERE id = p.id LIMIT 1))
    ) AS q(quantity, price)
    LIMIT 1
    ) AS oi
WHERE o.user_id = test_user_id
ON CONFLICT DO NOTHING;

END $$;

-- Alternative simpler seeding approach if the above doesn't work
-- This version uses hardcoded UUIDs for relationships
-- Uncomment and modify if needed:

/*
-- Get a test user_id (you must have at least one user)
DO $$
DECLARE
    test_user_id UUID;
    cat_electronics_id UUID;
    cat_clothing_id UUID;
    cat_books_id UUID;
    cat_home_id UUID;
    cat_sports_id UUID;
BEGIN
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found. Please create at least one user first.';
    END IF;

    -- Insert categories and get their IDs
    INSERT INTO public.categories (id, name, description, user_id) VALUES
        (gen_random_uuid(), 'Electronics', 'Electronic devices', test_user_id),
        (gen_random_uuid(), 'Clothing', 'Apparel', test_user_id),
        (gen_random_uuid(), 'Books', 'Reading materials', test_user_id),
        (gen_random_uuid(), 'Home & Garden', 'Home supplies', test_user_id),
        (gen_random_uuid(), 'Sports', 'Sports equipment', test_user_id)
    RETURNING id INTO cat_electronics_id, cat_clothing_id, cat_books_id, cat_home_id, cat_sports_id;

    -- Insert products
    INSERT INTO public.products (name, description, price, category_id, user_id) VALUES
        ('Laptop', 'High-performance laptop', 999.99, cat_electronics_id, test_user_id),
        ('Smartphone', 'Latest smartphone', 699.99, cat_electronics_id, test_user_id),
        ('T-Shirt', 'Cotton t-shirt', 19.99, cat_clothing_id, test_user_id),
        ('Novel', 'Fiction novel', 14.99, cat_books_id, test_user_id);

    -- Insert orders and get their IDs
    INSERT INTO public.orders (user_id, total_amount, status) VALUES
        (test_user_id, 1049.98, 'pending'),
        (test_user_id, 69.98, 'processing')
    RETURNING id INTO ...; -- Continue with order_items

END $$;
*/

