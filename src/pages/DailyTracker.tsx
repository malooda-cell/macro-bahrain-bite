import { MacroDisplay } from "@/components/MacroDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2, TrendingUp, Plus } from "lucide-react";
import { useMealLogs } from "@/hooks/useMealLogs";
import { useNavigate } from "react-router-dom";

export default function DailyTracker() {
  const navigate = useNavigate();
  // For now, use a dummy user ID - in a real app this would come from auth
  const dummyUserId = 'user_001';
  const today = new Date().toISOString().split('T')[0];
  
  const { data: mealLogs = [], isLoading, error } = useMealLogs(dummyUserId, today);

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

  const loggedMeals = mealLogs;

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
                  <div className="col-span-5">Dish Name</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-3 text-center">Time</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>

                {/* Table Rows */}
                {mealLogs.map((item) => (
                  <div 
                    key={item.id}
                    className="grid grid-cols-12 gap-2 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-5">
                      <div className="font-medium text-card-foreground text-sm">
                        {item.dishes?.dish_name || 'Unknown Dish'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.dishes?.calories} cal
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <Badge variant="outline" className="text-xs">
                        {item.quantity}
                      </Badge>
                    </div>
                    <div className="col-span-3 text-center text-xs text-muted-foreground">
                      {new Date(item.logged_at).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="col-span-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
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