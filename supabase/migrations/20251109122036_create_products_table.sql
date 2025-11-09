-- Create products table
CREATE TABLE IF NOT EXISTS public.products
(
    id
    UUID
    DEFAULT
    gen_random_uuid
(
) PRIMARY KEY,
    name VARCHAR
(
    255
) NOT NULL,
    description TEXT,
    price DECIMAL
(
    10,
    2
) NOT NULL CHECK
(
    price
    >=
    0
),
    category_id UUID NOT NULL REFERENCES public.categories
(
    id
) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES auth.users
(
    id
)
  ON DELETE CASCADE,
    created_at TIMESTAMP
  WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP
  WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
-- SELECT: All authenticated users can read
CREATE
POLICY "Products are viewable by all authenticated users"
    ON public.products
    FOR
SELECT
    TO authenticated
    USING (true);

-- INSERT: All authenticated users can create
CREATE
POLICY "Products are insertable by authenticated users"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- UPDATE: Only owner can update
CREATE
POLICY "Products are updatable by owner"
    ON public.products
    FOR
UPDATE
    TO authenticated
    USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE: Only owner can delete
CREATE
POLICY "Products are deletable by owner"
    ON public.products
    FOR DELETE
TO authenticated
    USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE
    ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_products_category_id ON public.products (category_id);
CREATE INDEX idx_products_user_id ON public.products (user_id);

