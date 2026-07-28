-- ThreadHub B2B Textile Marketplace Schema Migration

-- Add B2B-specific columns to products table if they don't exist
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS moq INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS weight_per_unit DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS thickness_mm DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS tensile_strength_mpa DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS cone_size_kg DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS yarn_category TEXT,
ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS technical_specs JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS supplier_name TEXT,
ADD COLUMN IF NOT EXISTS lead_time_days INTEGER DEFAULT 7;

-- Create yarn_categories table
CREATE TABLE IF NOT EXISTS public.yarn_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for yarn_categories
ALTER TABLE public.yarn_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for yarn_categories (public read)
CREATE POLICY IF NOT EXISTS "yarn_categories_public_read" ON public.yarn_categories 
  FOR SELECT USING (true);

-- Insert yarn categories
INSERT INTO public.yarn_categories (name, slug, description) VALUES
  ('Acrylic Yarn', 'acrylic', 'Durable and versatile acrylic fibers'),
  ('Blended Yarn', 'blended', 'Mixed fiber blends for optimal properties'),
  ('Cotton Yarn', 'cotton', 'Pure cotton yarns for natural textiles'),
  ('Embroidery Thread', 'embroidery', 'Fine threads for embroidery work'),
  ('Linen Yarn', 'linen', 'Premium linen for high-quality fabrics'),
  ('Nylon Yarn', 'nylon', 'Strong synthetic nylon fibers'),
  ('Polyester Yarn', 'polyester', 'Synthetic polyester for durability'),
  ('Silk Yarn', 'silk', 'Luxury silk fibers'),
  ('Spandex Yarn', 'spandex', 'Elastic spandex for stretch fabrics'),
  ('Technical Yarn', 'technical', 'Performance technical fibers'),
  ('Wool Yarn', 'wool', 'Premium wool for knitting and weaving')
ON CONFLICT (name) DO NOTHING;

-- Create bulk_orders table for B2B orders
CREATE TABLE IF NOT EXISTS public.bulk_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(12,2),
  items JSONB,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for bulk_orders
ALTER TABLE public.bulk_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bulk_orders
CREATE POLICY IF NOT EXISTS "Users can view their own orders" ON public.bulk_orders 
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY IF NOT EXISTS "Users can create their own orders" ON public.bulk_orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY IF NOT EXISTS "Users can update their own orders" ON public.bulk_orders 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create inquiry table for bulk inquiries
CREATE TABLE IF NOT EXISTS public.bulk_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  email TEXT,
  company_name TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for bulk_inquiries
ALTER TABLE public.bulk_inquiries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bulk_inquiries
CREATE POLICY IF NOT EXISTS "Users can view their own inquiries" ON public.bulk_inquiries 
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
  
CREATE POLICY IF NOT EXISTS "Users can create inquiries" ON public.bulk_inquiries 
  FOR INSERT WITH CHECK (true);
