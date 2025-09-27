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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary border-b border-border/20 p-8 shadow-soft">
        <h1 className="text-3xl font-bold mb-3 text-foreground">Macro Fireej</h1>
        <p className="text-muted-foreground text-lg">Discover healthy cafeterias in Bahrain</p>
      </div>

      {/* Search and Filters */}
      <div className="p-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search restaurants or cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 rounded-xl border-border/40 focus:border-primary/40"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
          <Button
            variant={selectedNeighborhood === null ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedNeighborhood(null)}
            className="shrink-0 rounded-xl"
          >
            All Areas
          </Button>
          {neighborhoods.map(neighborhood => (
            <Button
              key={neighborhood}
              variant={selectedNeighborhood === neighborhood ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedNeighborhood(neighborhood)}
              className="shrink-0 rounded-xl"
            >
              {neighborhood}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {filteredRestaurants.length} Restaurants Found
          </h2>
          <Badge variant="secondary" className="rounded-full px-4 py-2">
            {selectedNeighborhood || 'All Areas'}
          </Badge>
        </div>

        <div className="grid gap-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.restaurant_id}
              restaurant={restaurant}
              onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}`)}
            />
          ))}
        </div>

        {filteredRestaurants.length === 0 && restaurants.length > 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6 text-lg">No restaurants found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedNeighborhood(null);
              }}
              className="rounded-xl"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {restaurants.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">No cafeterias yet</h3>
            <p className="text-muted-foreground text-lg">Check back soon for new locations!</p>
          </div>
        )}
      </div>
    </div>
  );
}