import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Zap } from "lucide-react";
import { useDish } from "@/hooks/useDishes";
import { useAddMealLog } from "@/hooks/useMealLogs";
import { useToast } from "@/hooks/use-toast";

export default function DishDetails() {
  const { dishId, restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: dish, isLoading } = useDish(dishId!);
  const addMealLog = useAddMealLog();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dish details...</p>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-2">Dish not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleAddToLog = () => {
    // For now, use a dummy user ID - in a real app this would come from auth
    const dummyUserId = 'user_001';
    addMealLog.mutate({ 
      dishId: dish.dish_id, 
      userId: dummyUserId 
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-float">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          className="mb-3 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurant
        </Button>
        
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold pr-4">
            {dish.dish_name}
          </h1>
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground shrink-0">
            <Zap className="w-3 h-3 mr-1" />
            {dish.calories} cal
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Macro Overview */}
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Nutritional Information</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {dish.calories}
                </div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold text-accent">
                  {dish.protein_g + dish.carbs_g + dish.fat_g}g
                </div>
                <div className="text-sm text-muted-foreground">Total Macros</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-xl font-bold text-success">{dish.protein_g}g</div>
                <div className="text-xs text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <div className="text-xl font-bold text-accent">{dish.carbs_g}g</div>
                <div className="text-xs text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-3 bg-destructive/10 rounded-lg">
                <div className="text-xl font-bold text-destructive">{dish.fat_g}g</div>
                <div className="text-xs text-muted-foreground">Fat</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <p className="text-muted-foreground leading-relaxed">
              {dish.ingredients}
            </p>
          </CardContent>
        </Card>

        {/* Add to Log Button */}
        <Button
          className="w-full h-14 text-lg bg-gradient-primary hover:opacity-90 shadow-card"
          onClick={handleAddToLog}
          disabled={addMealLog.isPending}
        >
          <Plus className="w-5 h-5 mr-2" />
          {addMealLog.isPending ? 'Adding...' : 'Add to My Log'}
        </Button>
      </div>
    </div>
  );
}