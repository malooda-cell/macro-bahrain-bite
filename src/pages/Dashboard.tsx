import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Target } from "lucide-react";
import { useMealLogs } from "@/hooks/useMealLogs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  
  const { data: mealLogs = [], isLoading, error } = useMealLogs(user?.id || '', today);

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
          <h2 className="text-xl font-semibold mb-4">Sign in to view your dashboard</h2>
          <Button onClick={() => navigate('/auth')} variant="primary">
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
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load dashboard</p>
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

  // Prepare chart data
  const macroData = [
    { name: 'Protein', value: Math.round(dailyTotals.protein), color: 'hsl(var(--success))' },
    { name: 'Carbs', value: Math.round(dailyTotals.carbs), color: 'hsl(var(--accent))' },
    { name: 'Fat', value: Math.round(dailyTotals.fat), color: 'hsl(var(--destructive))' }
  ];

  const barData = [
    { 
      name: 'Calories', 
      current: Math.round(dailyTotals.calories), 
      target: targets.calories,
      percentage: Math.round((dailyTotals.calories / targets.calories) * 100)
    },
    { 
      name: 'Protein', 
      current: Math.round(dailyTotals.protein), 
      target: targets.protein,
      percentage: Math.round((dailyTotals.protein / targets.protein) * 100)
    },
    { 
      name: 'Carbs', 
      current: Math.round(dailyTotals.carbs), 
      target: targets.carbs,
      percentage: Math.round((dailyTotals.carbs / targets.carbs) * 100)
    },
    { 
      name: 'Fat', 
      current: Math.round(dailyTotals.fat), 
      target: targets.fat,
      percentage: Math.round((dailyTotals.fat / targets.fat) * 100)
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary border-b border-border/20 p-8 shadow-soft">
        <div className="flex items-center justify-end mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/about')}
            className="rounded-xl text-muted-foreground hover:text-foreground"
          >
            About
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-foreground">Dashboard</h1>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-lg">{new Date().toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          <Badge variant="secondary" className="rounded-full px-4 py-2">
            {mealLogs.length} meals
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Big Number Tiles */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border-border/40 rounded-2xl shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {Math.round(dailyTotals.calories)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Calories</div>
              <div className="text-xs text-accent">
                {Math.round((dailyTotals.calories / targets.calories) * 100)}% of goal
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/40 rounded-2xl shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-success mb-1">
                {Math.round(dailyTotals.protein)}g
              </div>
              <div className="text-sm text-muted-foreground mb-2">Protein</div>
              <div className="text-xs text-accent">
                {Math.round((dailyTotals.protein / targets.protein) * 100)}% of goal
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/40 rounded-2xl shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-accent mb-1">
                {Math.round(dailyTotals.carbs)}g
              </div>
              <div className="text-sm text-muted-foreground mb-2">Carbs</div>
              <div className="text-xs text-accent">
                {Math.round((dailyTotals.carbs / targets.carbs) * 100)}% of goal
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/40 rounded-2xl shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-destructive mb-1">
                {Math.round(dailyTotals.fat)}g
              </div>
              <div className="text-sm text-muted-foreground mb-2">Fat</div>
              <div className="text-xs text-accent">
                {Math.round((dailyTotals.fat / targets.fat) * 100)}% of goal
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Macro Breakdown Pie Chart */}
        <Card className="bg-white border-border/40 rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Macro Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}g`}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Chart */}
        <Card className="bg-white border-border/40 rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Daily Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'current' ? `${value} (${((value as number) / barData.find(d => d.current === value)?.target! * 100).toFixed(0)}%)` : value,
                      name === 'current' ? 'Current' : 'Target'
                    ]}
                  />
                  <Bar dataKey="current" fill="hsl(var(--primary))" />
                  <Bar dataKey="target" fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {mealLogs.length === 0 && (
          <Card className="bg-white border-border/40 rounded-2xl shadow-card">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">No meals logged today</h3>
              <p className="text-muted-foreground mb-4">Start tracking your nutrition by browsing restaurants</p>
              <Button onClick={() => window.location.href = '/'} variant="primary">
                Browse Restaurants
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}