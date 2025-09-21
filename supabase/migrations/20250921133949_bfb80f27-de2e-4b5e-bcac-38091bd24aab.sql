-- Create restaurants table
CREATE TABLE IF NOT EXISTS public.restaurants (
  restaurant_id TEXT PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  price_band TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dishes table
CREATE TABLE IF NOT EXISTS public.dishes (
  dish_id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES public.restaurants(restaurant_id) ON DELETE CASCADE,
  dish_name TEXT NOT NULL,
  ingredients TEXT,
  calories INTEGER NOT NULL,
  carbs_g DECIMAL(5,2) NOT NULL,
  fat_g DECIMAL(5,2) NOT NULL,
  protein_g DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_logs table
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  dish_id TEXT NOT NULL REFERENCES public.dishes(dish_id) ON DELETE CASCADE,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  quantity DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for restaurants (public read access)
CREATE POLICY "Anyone can view restaurants" ON public.restaurants FOR SELECT USING (true);

-- Create policies for dishes (public read access)
CREATE POLICY "Anyone can view dishes" ON public.dishes FOR SELECT USING (true);

-- Create policies for meal_logs (user-specific access)
CREATE POLICY "Users can view their own meal logs" ON public.meal_logs FOR SELECT USING (true); -- Since we don't have auth yet, allow all for now
CREATE POLICY "Users can insert their own meal logs" ON public.meal_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own meal logs" ON public.meal_logs FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own meal logs" ON public.meal_logs FOR DELETE USING (true);

-- Insert restaurant data (10 unique restaurants)
INSERT INTO public.restaurants (restaurant_id, restaurant_name, neighborhood, cuisine, price_band) VALUES
('rest_001', 'Al Aunss', 'Jid Ali', 'Arabic', 'budget'),
('rest_002', 'Al Shoala', 'Jid Ali', 'Arabic', 'budget'),
('rest_003', 'Karama', 'Jid Ali', 'Arabic', 'budget'),
('rest_004', 'Al Narjis', 'Jid Ali', 'Arabic', 'budget'),
('rest_005', 'Al Jabriya', 'Jid Ali', 'Arabic', 'budget'),
('rest_006', '123 Max', 'Jid Ali', 'Arabic', 'budget'),
('rest_007', '1 Whole Sandwich', 'Jid Ali', 'Arabic', 'budget'),
('rest_008', 'Al Ahali', 'Jid Ali', 'Arabic', 'budget'),
('rest_009', 'Ranoosh', 'Jid Ali', 'Arabic', 'budget'),
('rest_010', 'Abu Al Falafel', 'Jid Ali', 'Arabic', 'budget')
ON CONFLICT (restaurant_id) DO UPDATE SET
  restaurant_name = EXCLUDED.restaurant_name,
  neighborhood = EXCLUDED.neighborhood,
  cuisine = EXCLUDED.cuisine,
  price_band = EXCLUDED.price_band,
  updated_at = NOW();

-- Insert dish data (17 dishes from the Google Sheet)
INSERT INTO public.dishes (dish_id, restaurant_id, dish_name, ingredients, calories, carbs_g, fat_g, protein_g) VALUES
('dish_001', 'rest_001', 'Shish tawook wrap', 'chicken shish tawook (170g), turkish flour tortilla (200g), misc sauces, misc vegetables', 830, 108.8, 18.6, 42.4),
('dish_002', 'rest_001', 'Meat kebab wrap', 'chicken shish tawook (120g), turkish flour tortilla (200g), misc sauces, misc vegetables', 908, 104.2, 30.2, 34.8),
('dish_003', 'rest_001', 'Chicken shwarma wrap', 'chicken shawarma (75g), pita bread (50g), french fries (25g), misc sauces, misc vegetables', 345, 39.3, 8.6, 19.5),
('dish_004', 'rest_001', 'Meat shwarma wrap', 'gyro meat (70g), pita bread (50g), french fries (25g), misc sauces, misc vegetables', 426, 39.4, 16.0, 21.9),
('dish_005', 'rest_001', 'Half grilled chicken (with bread)', 'chicken breast (124g), chicken thigh (76g), turkish flour tortilla (166g), french fries (18g)', 889, 88.7, 30.8, 66.8),
('dish_006', 'rest_002', 'Chicken shwarma wrap', 'chicken shawarma (94g), pita bread (50g), french fries (25g), misc sauces, misc vegetables', 391, 39.7, 9.7, 23.1),
('dish_007', 'rest_002', 'Chicken shwarma plate (small)', 'chicken shwarma (190g), pita bread (150g), french fries (50g)', 823, 107.3, 20.2, 51.2),
('dish_008', 'rest_002', 'Chicken shwarma plate (large)', 'chicken shwarma (325g), pita bread (200g), french fries (50g)', 1006, 109.6, 28.1, 76.6),
('dish_009', 'rest_003', 'Liver malgoom wrap', 'lamb liver (50g), saj bread (60g), processed cheese (1 slice), french fries (25g), misc sauces, misc vegetables', 433, 38.7, 16.6, 23.2),
('dish_010', 'rest_003', 'Cheeseburger sandwich', 'burger patty (55g), burger bun (50g), processed cheese (1 slice), misc sauces, misc vegetablies', 397, 29.4, 14.7, 22.7),
('dish_011', 'rest_004', 'Chicken shwarma wrap', 'chicken shawarma (70g), pita bread (50g), french fries (25g), misc sauces, misc vegetables', 339, 29.1, 4.7, 17.8),
('dish_012', 'rest_005', 'Half grilled chicken (with bread)', 'chicken breast (124g), chicken thigh (76g), turkish flour tortilla (47g), french fries (18g)', 543, 27.6, 22.8, 58.2),
('dish_013', 'rest_006', 'Chicken shwarma plate', 'chicken shwarma (170g), pita bread (70g), french fries (50g)', 514, 62.2, 18.0, 40.0),
('dish_014', 'rest_007', 'Mortadella sandwich (with honey mustard)', 'mortadella (36g), whole meal brown bread (70g), processed cheese (1 slice), mayonnaise (12g), honey mustard (1/4 tbsp)', 445, 40.9, 24.4, 14.8),
('dish_016', 'rest_008', 'Liver sandwich', 'lamb liver (30g), burger bun (40g), processed cheese (1 slice), misc sauces, misc veggies', 262, 22.6, 9.0, 16.6),
('dish_017', 'rest_009', 'Liver sandwich', 'lamb liver (60g), pita bread (25g), processed cheese (1 slice), misc sauces, misc veggies', 305, 17.2, 10.5, 24.1),
('dish_018', 'rest_010', 'Liver sandwich', 'lamb liver (70g), pita bread (25g), processed cheese (1 slice), misc sauces, misc veggies', 320, 17.5, 11.4, 27.4)
ON CONFLICT (dish_id) DO UPDATE SET
  restaurant_id = EXCLUDED.restaurant_id,
  dish_name = EXCLUDED.dish_name,
  ingredients = EXCLUDED.ingredients,
  calories = EXCLUDED.calories,
  carbs_g = EXCLUDED.carbs_g,
  fat_g = EXCLUDED.fat_g,
  protein_g = EXCLUDED.protein_g,
  updated_at = NOW();

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON public.dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();