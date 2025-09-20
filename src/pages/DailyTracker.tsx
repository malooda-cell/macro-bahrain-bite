import { MacroDisplay } from "@/components/MacroDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2, TrendingUp } from "lucide-react";
import { useMealLogs } from "@/hooks/useMealLogs";

export default function DailyTracker() {
  // For now, use a dummy user ID - in a real app this would come from auth
  const dummyUserId = 'user_001';
  const today = new Date().toISOString().split('T')[0];
  
  const { data: mealLogs = [], isLoading, error } = useMealLogs(dummyUserId, today);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading meal logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 shadow-float">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Daily Tracker</h1>
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
            {mealLogs.length} meals logged
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Macro Overview */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MacroDisplay
              label="Calories"
              current={dailyTotals.calories}
              target={targets.calories}
              unit=""
              color="primary"
            />
            <MacroDisplay
              label="Protein"
              current={dailyTotals.protein}
              target={targets.protein}
              unit="g"
              color="success"
            />
            <MacroDisplay
              label="Carbohydrates"
              current={dailyTotals.carbs}
              target={targets.carbs}
              unit="g"
              color="accent"
            />
            <MacroDisplay
              label="Fat"
              current={dailyTotals.fat}
              target={targets.fat}
              unit="g"
              color="destructive"
            />
          </CardContent>
        </Card>

        {/* Logged Meals */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Logged Meals</CardTitle>
          </CardHeader>
          <CardContent>
            {loggedMeals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No meals logged today</p>
                <Button onClick={() => window.history.back()}>
                  Browse Restaurants
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {loggedMeals.map((item) => (
                  <div 
                    key={item.log_id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-card-foreground">
                        {item.dishes?.dish_name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{item.dishes?.calories} cal</span>
                        <span>{item.dishes?.protein_g}g protein</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(item.logged_at).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round((dailyTotals.calories / targets.calories) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Daily Goal</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {dailyTotals.protein}g
              </div>
              <div className="text-sm text-muted-foreground">Protein Intake</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}