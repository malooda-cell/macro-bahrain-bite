import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Zap } from "lucide-react";
import { useDish } from "@/hooks/useDishes";
import { useAddMealLog } from "@/hooks/useMealLogs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { QuantitySelectionModal } from "@/components/QuantitySelectionModal";

export default function DishDetails() {
  const { dishId, restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  
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
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add meals to your log",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    setShowQuantityModal(true);
  };

  const handleQuantityConfirm = (quantity: number) => {
    addMealLog.mutate({ 
      dishId: dish!.dish_id, 
      userId: user!.id,
      quantity 
    });
  };

  return (
    <>
      <QuantitySelectionModal
        isOpen={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        dish={dish}
        onConfirm={handleQuantityConfirm}
        isLoading={addMealLog.isPending}
      />
      
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary border-b border-border/20 p-8 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/restaurant/${restaurantId}`)}
            className="text-muted-foreground hover:bg-muted rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Restaurant
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/about')}
            className="rounded-xl text-muted-foreground hover:text-foreground"
          >
            About
          </Button>
        </div>
        
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-foreground pr-4">
            {dish.dish_name}
          </h1>
          <Badge variant="secondary" className="rounded-full px-4 py-2 shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {dish.calories} cal
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Macro Overview */}
        <Card className="bg-white border-border/40 rounded-2xl shadow-card">
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
              <div className="text-center p-3 bg-amber/10 rounded-lg">
                <div className="text-xl font-bold text-amber">{dish.carbs_g}g</div>
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
        <Card className="bg-white border-border/40 rounded-2xl shadow-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <p className="text-muted-foreground leading-relaxed">
              {dish.ingredients}
            </p>
          </CardContent>
        </Card>

        {/* Add to Log Button */}
        <Button
          variant="primary"
          className="w-full h-14 text-lg shadow-card"
          onClick={handleAddToLog}
          disabled={addMealLog.isPending}
        >
          <Plus className="w-5 h-5 mr-2" />
          {addMealLog.isPending ? 'Adding...' : 'Add to My Log'}
        </Button>
      </div>
    </div>
    </>
  );
}