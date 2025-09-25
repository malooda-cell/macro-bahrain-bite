import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, X, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuantityEditorProps {
  initialQuantity: number;
  onSave: (quantity: number) => void;
  isLoading?: boolean;
}

export function QuantityEditor({ initialQuantity, onSave, isLoading }: QuantityEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const { toast } = useToast();

  const handleSave = () => {
    if (quantity >= 1 && quantity <= 5 && Number.isInteger(quantity)) {
      onSave(quantity);
      setIsEditing(false);
    } else {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be a whole number between 1 and 5",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setQuantity(initialQuantity);
    setIsEditing(false);
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
      setQuantity(numValue);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          min="1"
          max="5"
          step="1"
          className="h-6 w-12 text-xs text-center"
          disabled={isLoading}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={isLoading}
          className="h-6 w-6 p-0 text-success hover:text-success hover:bg-success/10"
        >
          <Check className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={isLoading}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Badge variant="outline" className="text-xs">
        {initialQuantity}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="h-6 w-6 p-0 text-accent hover:text-accent hover:bg-accent/10"
      >
        <Edit3 className="w-3 h-3" />
      </Button>
    </div>
  );
}