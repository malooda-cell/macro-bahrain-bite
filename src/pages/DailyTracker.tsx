import { MacroDisplay } from "@/components/MacroDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Trash2, TrendingUp, Plus, Edit3, Check, X } from "lucide-react";
import { useMealLogs, useUpdateMealLog, useDeleteMealLog } from "@/hooks/useMealLogs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DailyTracker() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);
  
  const { data: mealLogs = [], isLoading, error } = useMealLogs(user?.id || '', today);
  const updateMealLog = useUpdateMealLog();
  const deleteMealLog = useDeleteMealLog();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-4">Sign in to view your meal log</h2>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-primary">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading meal logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load meal logs</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const dailyTotals = mealLogs.reduce((totals, log) => {
    const dish = log.dishes;
    if (dish) {
      totals.calories += dish.calories * log.quantity;
      totals.protein += dish.protein_g * log.quantity;
      totals.carbs += dish.carbs_g * log.quantity;
      totals.fat += dish.fat_g * log.quantity;
    }
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Daily targets (these would be user-configurable in a real app)
  const targets = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  };

  const handleEditQuantity = (id: string, currentQuantity: number) => {
    setEditingId(id);
    setEditQuantity(currentQuantity);
  };

  const handleSaveQuantity = () => {
    if (editingId && editQuantity > 0) {
      updateMealLog.mutate({
        logId: editingId,
        quantity: editQuantity
      });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuantity(1);
  };

  const handleDeleteMeal = (id: string) => {
    deleteMealLog.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 shadow-float">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">My Log</h1>
            <div className="flex items-center text-primary-foreground/80">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date().toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
            {mealLogs.length} meals
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Today's Totals */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Today's Totals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(dailyTotals.calories)}
                </div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {Math.round(dailyTotals.protein)}g
                </div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(dailyTotals.carbs)}g
                </div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">
                  {Math.round(dailyTotals.fat)}g
                </div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Log Table */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Meal Log Entries</span>
              <Button 
                size="sm" 
                onClick={() => navigate('/')}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Meal
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mealLogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No meals logged today</p>
                <Button onClick={() => navigate('/')} className="bg-gradient-primary">
                  Browse Restaurants
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 pb-2 border-b border-border text-sm font-medium text-muted-foreground">
                  <div className="col-span-4">Dish Name</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-3 text-center">Time</div>
                  <div className="col-span-3 text-center">Actions</div>
                </div>

                {/* Table Rows */}
                {mealLogs.map((item) => (
                  <div 
                    key={item.id}
                    className="grid grid-cols-12 gap-2 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-4">
                      <div className="font-medium text-card-foreground text-sm">
                        {item.dishes?.dish_name || 'Unknown Dish'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.dishes?.calories} cal
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(Number(e.target.value))}
                          min="0.1"
                          step="0.1"
                          className="h-6 w-12 text-xs text-center"
                        />
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {item.quantity}
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-3 text-center text-xs text-muted-foreground">
                      {new Date(item.logged_at).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="col-span-3 text-center flex justify-center gap-1">
                      {editingId === item.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveQuantity}
                            className="h-6 w-6 p-0 text-success hover:text-success hover:bg-success/10"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuantity(item.id, item.quantity)}
                            className="h-6 w-6 p-0 text-accent hover:text-accent hover:bg-accent/10"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMeal(item.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}