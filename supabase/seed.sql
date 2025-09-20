-- Insert restaurant data from Google Sheet
INSERT INTO restaurants (restaurant_id, restaurant_name, neighborhood, cuisine, price_band) VALUES
('rest_001', 'Al Aunss', 'Jid Ali', 'Arabic', 'budget'),
('rest_002', 'Al Shoala', 'Jid Ali', 'Arabic', 'budget'),
('rest_003', 'Karama', 'Jid Ali', 'Arabic', 'budget'),
('rest_004', 'Al Narjis', 'Jid Ali', 'Arabic', 'budget'),
('rest_005', 'Al Jabriya', 'Jid Ali', 'Arabic', 'budget'),
('rest_006', '123 Max', 'Jid Ali', 'Arabic', 'budget'),
('rest_007', '1 Whole Sandwich', 'Jid Ali', 'Sandwiches', 'budget'),
('rest_008', 'Al Ahali', 'Jid Ali', 'Arabic', 'budget'),
('rest_009', 'Ranoosh', 'Jid Ali', 'Arabic', 'budget'),
('rest_010', 'Abu Al Falafel', 'Jid Ali', 'Arabic', 'budget')
ON CONFLICT (restaurant_id) DO UPDATE SET
  restaurant_name = EXCLUDED.restaurant_name,
  neighborhood = EXCLUDED.neighborhood,
  cuisine = EXCLUDED.cuisine,
  price_band = EXCLUDED.price_band;

-- Sample dishes (you'll need to provide the actual dish data from your sheet)
INSERT INTO dishes (dish_id, restaurant_id, dish_name, calories, protein_g, carbs_g, fat_g, ingredients) VALUES
('dish_001', 'rest_001', 'Mixed Grill', 650, 45.0, 25.0, 35.0, 'Lamb kebab, chicken tikka, rice, grilled vegetables, tahini sauce'),
('dish_002', 'rest_001', 'Chicken Shawarma', 420, 35.0, 45.0, 18.0, 'Grilled chicken, pita bread, garlic sauce, pickles, tomatoes'),
('dish_003', 'rest_002', 'Falafel Plate', 380, 15.0, 55.0, 12.0, 'Chickpea falafel, hummus, tabbouleh, pita bread, tahini'),
('dish_004', 'rest_003', 'Lamb Machboos', 720, 40.0, 65.0, 28.0, 'Tender lamb, basmati rice, baharat spices, dried lime, onions'),
('dish_005', 'rest_007', 'Club Sandwich', 520, 28.0, 48.0, 24.0, 'Grilled chicken, turkey, lettuce, tomato, cheese, mayo, bread')
ON CONFLICT (dish_id) DO UPDATE SET
  restaurant_id = EXCLUDED.restaurant_id,
  dish_name = EXCLUDED.dish_name,
  calories = EXCLUDED.calories,
  protein_g = EXCLUDED.protein_g,
  carbs_g = EXCLUDED.carbs_g,
  fat_g = EXCLUDED.fat_g,
  ingredients = EXCLUDED.ingredients;