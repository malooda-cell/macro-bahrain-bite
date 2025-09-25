import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap } from "lucide-react";

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
  onAddToLog: (dish: Dish) => void;
  onViewDetails: (dish: Dish) => void;
}

export function DishCard({ dish, onAddToLog, onViewDetails }: DishCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-card bg-gradient-card border-border/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-card-foreground leading-tight">
            {dish.dish_name}
          </h4>
          <Badge variant="secondary" className="ml-2 shrink-0">
            <Zap className="w-3 h-3 mr-1" />
            {dish.calories}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary border-0">
            P: {dish.protein_g}g
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium bg-accent/10 text-accent border-0">
            C: {dish.carbs_g}g
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium bg-destructive/10 text-destructive border-0">
            F: {dish.fat_g}g
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {dish.ingredients}
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(dish)}
          >
            Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-primary hover:opacity-90"
            onClick={() => onAddToLog(dish)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}