export interface Restaurant {
  restaurant_id: string;
  restaurant_name: string;
  neighborhood: string;
  cuisine: string;
  price_band: string;
}

export interface Dish {
  dish_id: string;
  restaurant_id: string;
  dish_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: string;
}

export interface MealLog {
  log_id: string;
  user_id: string;
  dish_id: string;
  quantity: number;
  logged_at: string;
}

export const mockRestaurants: Restaurant[] = [
  {
    restaurant_id: "rest_001",
    restaurant_name: "Al Shami Cafeteria",
    neighborhood: "Manama",
    cuisine: "Middle Eastern",
    price_band: "Budget"
  },
  {
    restaurant_id: "rest_002", 
    restaurant_name: "Fresh Corner",
    neighborhood: "Riffa",
    cuisine: "International",
    price_band: "Mid-Range"
  },
  {
    restaurant_id: "rest_003",
    restaurant_name: "Healthy Bites",
    neighborhood: "Juffair",
    cuisine: "Mediterranean",
    price_band: "Premium"
  },
  {
    restaurant_id: "rest_004",
    restaurant_name: "Gulf Delights",
    neighborhood: "Muharraq",
    cuisine: "Arabian",
    price_band: "Budget"
  },
  {
    restaurant_id: "rest_005",
    restaurant_name: "Green Garden",
    neighborhood: "Saar",
    cuisine: "Vegetarian",
    price_band: "Mid-Range"
  }
];

export const mockDishes: Dish[] = [
  // Al Shami Cafeteria dishes
  {
    dish_id: "dish_001",
    restaurant_id: "rest_001",
    dish_name: "Chicken Machboos",
    calories: 650,
    protein_g: 45,
    carbs_g: 75,
    fat_g: 18,
    ingredients: "Basmati rice, chicken thighs, onions, tomatoes, baharat spice mix, saffron, dried lime"
  },
  {
    dish_id: "dish_002", 
    restaurant_id: "rest_001",
    dish_name: "Grilled Hammour with Rice",
    calories: 420,
    protein_g: 35,
    carbs_g: 45,
    fat_g: 8,
    ingredients: "Fresh hammour fillet, basmati rice, grilled vegetables, lemon, herbs"
  },
  {
    dish_id: "dish_003",
    restaurant_id: "rest_001", 
    dish_name: "Lamb Kabsa",
    calories: 720,
    protein_g: 40,
    carbs_g: 65,
    fat_g: 28,
    ingredients: "Tender lamb chunks, long grain rice, onions, cardamom, cinnamon, bay leaves"
  },
  
  // Fresh Corner dishes
  {
    dish_id: "dish_004",
    restaurant_id: "rest_002",
    dish_name: "Grilled Chicken Caesar Salad",
    calories: 380,
    protein_g: 32,
    carbs_g: 15,
    fat_g: 22,
    ingredients: "Grilled chicken breast, romaine lettuce, parmesan cheese, caesar dressing, croutons"
  },
  {
    dish_id: "dish_005",
    restaurant_id: "rest_002",
    dish_name: "Turkey Club Sandwich",
    calories: 520,
    protein_g: 28,
    carbs_g: 48,
    fat_g: 24,
    ingredients: "Sliced turkey breast, whole wheat bread, bacon, lettuce, tomato, mayo"
  },
  
  // Healthy Bites dishes
  {
    dish_id: "dish_006",
    restaurant_id: "rest_003",
    dish_name: "Quinoa Power Bowl",
    calories: 450,
    protein_g: 18,
    carbs_g: 58,
    fat_g: 16,
    ingredients: "Quinoa, chickpeas, avocado, cucumber, cherry tomatoes, tahini dressing"
  },
  {
    dish_id: "dish_007",
    restaurant_id: "rest_003",
    dish_name: "Grilled Salmon with Vegetables", 
    calories: 380,
    protein_g: 35,
    carbs_g: 12,
    fat_g: 22,
    ingredients: "Atlantic salmon fillet, broccoli, asparagus, bell peppers, olive oil, herbs"
  },
  
  // Gulf Delights dishes
  {
    dish_id: "dish_008",
    restaurant_id: "rest_004",
    dish_name: "Fish Curry with Rice",
    calories: 480,
    protein_g: 30,
    carbs_g: 55,
    fat_g: 14,
    ingredients: "White fish, coconut milk, curry spices, onions, tomatoes, jasmine rice"
  },
  {
    dish_id: "dish_009",
    restaurant_id: "rest_004",
    dish_name: "Chicken Biryani",
    calories: 680,
    protein_g: 38,
    carbs_g: 78,
    fat_g: 22,
    ingredients: "Chicken pieces, basmati rice, yogurt, garam masala, saffron, fried onions"
  }
];

export const mockMealLogs: MealLog[] = [
  {
    log_id: "log_001",
    user_id: "user_001",
    dish_id: "dish_001",
    quantity: 1,
    logged_at: new Date().toISOString()
  },
  {
    log_id: "log_002", 
    user_id: "user_001",
    dish_id: "dish_004",
    quantity: 1,
    logged_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  }
];