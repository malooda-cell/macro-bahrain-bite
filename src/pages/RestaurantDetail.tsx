import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DishCard } from "@/components/DishCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurants";
import { useDishes, type Dish } from "@/hooks/useDishes";
import { useAddMealLog } from "@/hooks/useMealLogs";
import { useToast } from "@/hooks/use-toast";

export default function RestaurantDetail() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId!);
  const { data: dishes = [], isLoading: dishesLoading } = useDishes(restaurantId);
  const addMealLog = useAddMealLog();

  const isLoading = restaurantLoading || dishesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Restaurant not found</h2>
          <Button onClick={() => navigate("/")}>Back to Restaurants</Button>
        </div>
      </div>
    );
  }

  const handleAddToLog = (dish: Dish) => {
    // For now, use a dummy user ID - in a real app this would come from auth
    const dummyUserId = 'user_001';
    addMealLog.mutate({ 
      dishId: dish.dish_id, 
      userId: dummyUserId 
    });
  };

  const handleViewDetails = (dish: Dish) => {
    setSelectedDish(dish);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border shadow-soft">
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Restaurants
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {restaurant.restaurant_name}
              </h1>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{restaurant.neighborhood}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{restaurant.cuisine}</Badge>
                <Badge variant="secondary">{restaurant.price_band}</Badge>
              </div>
            </div>
            <div className="flex items-center text-accent">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 font-medium">4.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dishes */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Menu ({dishes.length} dishes)
        </h2>
        
        <div className="grid gap-4">
          {dishes.map(dish => (
            <DishCard
              key={dish.dish_id}
              dish={dish}
              onAddToLog={handleAddToLog}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {dishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No dishes available for this restaurant</p>
          </div>
        )}
      </div>

      {/* Dish Details Modal */}
      <Dialog open={!!selectedDish} onOpenChange={() => setSelectedDish(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedDish?.dish_name}</DialogTitle>
          </DialogHeader>
          {selectedDish && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {selectedDish.calories}
                  </div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {selectedDish.protein_g + selectedDish.carbs_g + selectedDish.fat_g}g
                  </div>
                  <div className="text-sm text-muted-foreground">Total Macros</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-primary/10 rounded">
                  <div className="font-semibold text-primary">{selectedDish.protein_g}g</div>
                  <div className="text-xs text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-2 bg-accent/10 rounded">
                  <div className="font-semibold text-accent">{selectedDish.carbs_g}g</div>
                  <div className="text-xs text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-2 bg-destructive/10 rounded">
                  <div className="font-semibold text-destructive">{selectedDish.fat_g}g</div>
                  <div className="text-xs text-muted-foreground">Fat</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Ingredients</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedDish.ingredients}
                </p>
              </div>
              
              <Button
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={() => {
                  handleAddToLog(selectedDish);
                  setSelectedDish(null);
                }}
              >
                Add to Meal Log
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}