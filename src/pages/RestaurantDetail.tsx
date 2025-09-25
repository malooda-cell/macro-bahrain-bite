import { useParams, useNavigate } from "react-router-dom";
import { DishCard } from "@/components/DishCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Plus } from "lucide-react";
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
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-float">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-3 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurants
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground mb-2">
              {restaurant.restaurant_name}
            </h1>
            <div className="flex items-center text-primary-foreground/80 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{restaurant.neighborhood}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">
                {restaurant.cuisine}
              </Badge>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                {restaurant.price_band}
              </Badge>
            </div>
          </div>
          <div className="flex items-center text-accent">
            <Star className="w-5 h-5 fill-current text-primary-foreground" />
            <span className="ml-1 font-medium text-primary-foreground">4.2</span>
          </div>
        </div>
      </div>

      {/* Dishes */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Dishes at this cafeteria ({dishes.length} items)
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
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No dishes found for this cafeteria</h3>
            <p className="text-muted-foreground">The menu will be updated soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}