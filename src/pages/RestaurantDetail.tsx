import { useParams, useNavigate } from "react-router-dom";
import { DishCard } from "@/components/DishCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Plus, Utensils } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurants";
import { useDishes, type Dish } from "@/hooks/useDishes";
import { useAddMealLog } from "@/hooks/useMealLogs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function RestaurantDetail() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId!);
  const { data: dishes = [], isLoading: dishesLoading } = useDishes(restaurantId);
  const addMealLog = useAddMealLog();

  const isLoading = restaurantLoading || dishesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please create an account or sign in to add meals to your log",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    addMealLog.mutate({ 
      dishId: dish.dish_id, 
      userId: user!.id 
    });
  };

  const handleViewDetails = (dish: Dish) => {
    navigate(`/restaurant/${restaurantId}/dish/${dish.dish_id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary border-b border-border/20 p-8 shadow-soft">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4 text-muted-foreground hover:bg-muted rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurants
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {restaurant.restaurant_name}
            </h1>
            <div className="flex items-center text-muted-foreground mb-3">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{restaurant.neighborhood}</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-border text-foreground rounded-full px-4 py-2 flex items-center gap-1">
                <Utensils className="w-3 h-3" />
                {restaurant.cuisine}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-secondary-foreground rounded-full px-4 py-2">
                {restaurant.price_band}
              </Badge>
            </div>
          </div>
          <div className="flex items-center text-primary">
            <Star className="w-6 h-6 fill-current" />
            <span className="ml-2 font-medium text-lg">4.2</span>
          </div>
        </div>
      </div>

      {/* Dishes */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Dishes at this cafeteria ({dishes.length} items)
        </h2>
        
        <div className="grid gap-6">
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
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">No dishes found for this cafeteria</h3>
            <p className="text-muted-foreground text-lg">The menu will be updated soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}