import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Database, Users, Utensils, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Check if user has admin role
  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      return !!data;
    },
    enabled: !!user?.id && isAuthenticated
  });

  // Fetch restaurants
  const { data: restaurants = [] } = useQuery({
    queryKey: ['admin-restaurants'],
    queryFn: async () => {
      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .order('restaurant_name');
      return data || [];
    },
    enabled: isAdmin
  });

  // Fetch dishes
  const { data: dishes = [] } = useQuery({
    queryKey: ['admin-dishes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('dishes')
        .select('*, restaurants(restaurant_name)')
        .order('dish_name');
      return data || [];
    },
    enabled: isAdmin
  });

  // Fetch meal logs
  const { data: mealLogs = [] } = useQuery({
    queryKey: ['admin-meal-logs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('meal_logs')
        .select('*, dishes(dish_name)')
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: isAdmin
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="mb-4">Please sign in to access this page</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="mb-4 text-destructive">Access denied. Admin privileges required.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary border-b border-border/20 p-8 shadow-soft">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4 text-muted-foreground hover:bg-muted rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-3">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">Database overview and management</p>
      </div>

      <div className="p-6">
        <Tabs defaultValue="restaurants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Restaurants ({restaurants.length})
            </TabsTrigger>
            <TabsTrigger value="dishes" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Dishes ({dishes.length})
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Meal Logs ({mealLogs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants">
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.restaurant_id} className="bg-white border-border/40 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{restaurant.restaurant_name}</h3>
                      <Badge variant="secondary">{restaurant.price_band}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📍 {restaurant.neighborhood}</span>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Utensils className="w-3 h-3" />
                        {restaurant.cuisine}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dishes">
            <div className="space-y-4">
              {dishes.map((dish) => (
                <Card key={dish.dish_id} className="bg-white border-border/40 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{dish.dish_name}</h3>
                      <Badge variant="secondary">{dish.calories} cal</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">P: {dish.protein_g}g</Badge>
                      <Badge variant="outline" className="text-xs">C: {dish.carbs_g}g</Badge>
                      <Badge variant="outline" className="text-xs">F: {dish.fat_g}g</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-1">🏪 {dish.restaurants?.restaurant_name}</p>
                      <p className="line-clamp-2">{dish.ingredients}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="space-y-4">
              {mealLogs.map((log) => (
                <Card key={log.id} className="bg-white border-border/40 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{log.dishes?.dish_name}</h3>
                      <Badge variant="outline">
                        {new Date(log.logged_at).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>👤 User ID: {log.user_id.slice(0, 8)}...</span>
                      <span>Quantity: {log.quantity}</span>
                    </div>
                    {log.meal_type && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {log.meal_type}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}