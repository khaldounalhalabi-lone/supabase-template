-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories
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
    user_id UUID NOT NULL REFERENCES auth.users
(
    id
) ON DELETE CASCADE,
    created_at TIMESTAMP
  WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP
  WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
-- SELECT: All authenticated users can read
CREATE
POLICY "Categories are viewable by all authenticated users"
    ON public.categories
    FOR
SELECT
    TO authenticated
    USING (true);

-- INSERT: All authenticated users can create
CREATE
POLICY "Categories are insertable by authenticated users"
    ON public.categories
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- UPDATE: Only owner can update
CREATE
POLICY "Categories are updatable by owner"
    ON public.categories
    FOR
UPDATE
    TO authenticated
    USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE: Only owner can delete
CREATE
POLICY "Categories are deletable by owner"
    ON public.categories
    FOR DELETE
TO authenticated
    USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE
OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at
= timezone('utc'::text, now());
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE
    ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

