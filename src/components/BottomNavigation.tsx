import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, BarChart3, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();

  // Check if user has admin role
  const { data: isAdmin } = useQuery({
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: BookOpen,
      label: "My Log",
      path: "/my-log",
    },
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/dashboard",
    },
  ];

  // Add admin nav item if user is admin
  if (isAdmin) {
    navItems.splice(3, 0, {
      icon: Shield,
      label: "Admin",
      path: "/admin",
    });
  }

  // Hide navigation on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-float">
      <div className="flex justify-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`flex-1 h-16 flex-col gap-1 rounded-none px-4 ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
        
        {isAuthenticated && (
          <Button
            variant="ghost"
            className="flex-1 h-16 flex-col gap-1 rounded-none px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs">Sign Out</span>
          </Button>
        )}
      </div>
    </div>
  );
}