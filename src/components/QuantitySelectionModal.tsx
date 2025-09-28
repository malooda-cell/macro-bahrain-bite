import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Zap } from 'lucide-react';

interface Dish {
  dish_id: string;
  dish_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface QuantitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onConfirm: (quantity: number) => void;
  isLoading?: boolean;
}

export function QuantitySelectionModal({ 
  isOpen, 
  onClose, 
  dish, 
  onConfirm, 
  isLoading 
}: QuantitySelectionModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(quantity);
    handleClose();
  };

  const incrementQuantity = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!dish) return null;

  const totalCalories = dish.calories * quantity;
  const totalProtein = dish.protein_g * quantity;
  const totalCarbs = dish.carbs_g * quantity;
  const totalFat = dish.fat_g * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-gray-700 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Add to Log
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Dish Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{dish.dish_name}</h3>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              {dish.calories} cal per serving
            </Badge>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isLoading}
              className="h-10 w-10 rounded-full p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{quantity}</div>
              <div className="text-sm text-muted-foreground">
                {quantity === 1 ? 'serving' : 'servings'}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={incrementQuantity}
              disabled={quantity >= 5 || isLoading}
              className="h-10 w-10 rounded-full p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Total Macros Preview */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <h4 className="font-medium text-center mb-3">Total Nutrition</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalCalories}</div>
                <div className="text-xs text-muted-foreground">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{totalProtein + totalCarbs + totalFat}g</div>
                <div className="text-xs text-muted-foreground">Total Macros</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center p-2 bg-success/10 rounded-lg">
                <div className="text-sm font-bold text-success">{totalProtein}g</div>
                <div className="text-xs text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-2 bg-amber/10 rounded-lg">
                <div className="text-sm font-bold text-amber">{totalCarbs}g</div>
                <div className="text-xs text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-2 bg-destructive/10 rounded-lg">
                <div className="text-sm font-bold text-destructive">{totalFat}g</div>
                <div className="text-xs text-muted-foreground">Fat</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 rounded-xl"
            >
              {isLoading ? 'Adding...' : 'Add to Log'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}