import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap } from "lucide-react";
import { QuantitySelectionModal } from "@/components/QuantitySelectionModal";

interface Dish {
  dish_id: string;
  dish_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: string;
}

interface DishCardProps {
  dish: Dish;
  onAddToLog: (dish: Dish, quantity: number) => void;
  onViewDetails: (dish: Dish) => void;
}

export function DishCard({ dish, onAddToLog, onViewDetails }: DishCardProps) {
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  const handleQuantityConfirm = (quantity: number) => {
    onAddToLog(dish, quantity);
  };

  return (
    <>
      <QuantitySelectionModal
        isOpen={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        dish={dish}
        onConfirm={handleQuantityConfirm}
      />
      
    <Card className="transition-all duration-300 hover:shadow-card bg-white border-border/40 rounded-2xl overflow-hidden hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-lg text-card-foreground leading-tight">
            {dish.dish_name}
          </h4>
          <Badge variant="secondary" className="ml-2 shrink-0 rounded-full px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            {dish.calories} cal
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2.5 mb-4">
          <Badge variant="secondary" className="text-xs font-medium bg-primary/15 text-primary border-0 rounded-full px-3 py-1">
            Protein: {dish.protein_g}g
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium bg-accent/15 text-accent-foreground border-0 rounded-full px-3 py-1">
            Carbs: {dish.carbs_g}g
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium bg-destructive/15 text-destructive border-0 rounded-full px-3 py-1">
            Fat: {dish.fat_g}g
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {dish.ingredients}
        </p>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-xl"
            onClick={() => onViewDetails(dish)}
          >
            View Details
          </Button>
          <Button 
            variant="primary"
            size="sm" 
            className="flex-1 rounded-xl"
            onClick={() => setShowQuantityModal(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add to Log
          </Button>
        </div>
      </CardContent>
    </Card>
    </>
  );
}