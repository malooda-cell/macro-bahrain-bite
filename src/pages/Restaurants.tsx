import { useState } from "react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useNavigate } from "react-router-dom";

export default function Restaurants() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  
  const { data: restaurants = [], isLoading, error } = useRestaurants();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load restaurants</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const neighborhoods = [...new Set(restaurants.map(r => r.neighborhood))];
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNeighborhood = !selectedNeighborhood || restaurant.neighborhood === selectedNeighborhood;
    return matchesSearch && matchesNeighborhood;
  });

  return (
    <div className="min-h-screen bg-background pb-20">{/* Added pb-20 for bottom navigation */}
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 shadow-float">
        <h1 className="text-2xl font-bold mb-2">Macro Fireej</h1>
        <p className="text-primary-foreground/80">Discover healthy cafeterias in Bahrain</p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search restaurants or cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <Button
            variant={selectedNeighborhood === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedNeighborhood(null)}
            className="shrink-0"
          >
            All Areas
          </Button>
          {neighborhoods.map(neighborhood => (
            <Button
              key={neighborhood}
              variant={selectedNeighborhood === neighborhood ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedNeighborhood(neighborhood)}
              className="shrink-0"
            >
              {neighborhood}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {filteredRestaurants.length} Restaurants Found
          </h2>
          <Badge variant="secondary">
            {selectedNeighborhood || 'All Areas'}
          </Badge>
        </div>

        <div className="grid gap-4">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.restaurant_id}
              restaurant={restaurant}
              onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}`)}
            />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No restaurants found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedNeighborhood(null);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}