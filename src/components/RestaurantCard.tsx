import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Utensils } from "lucide-react";

interface Restaurant {
  restaurant_id: string;
  restaurant_name: string;
  neighborhood: string;
  cuisine: string;
  price_band: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const getPriceBadgeVariant = (priceBand: string) => {
    switch (priceBand.toLowerCase()) {
      case 'budget': return 'secondary';
      case 'mid-range': return 'default';
      case 'premium': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-2 bg-white border-border/40 rounded-2xl overflow-hidden hover:border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-card-foreground truncate">
            {restaurant.restaurant_name}
          </h3>
          <Badge variant={getPriceBadgeVariant(restaurant.price_band)} className="ml-2 shrink-0">
            {restaurant.price_band}
          </Badge>
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{restaurant.neighborhood}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Utensils className="w-3 h-3" />
            {restaurant.cuisine}
          </Badge>
          <div className="flex items-center text-accent">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">4.2</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}