import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

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

  // Hide navigation on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-float">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`flex-1 h-16 flex-col gap-1 rounded-none ${
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
            className="flex-1 h-16 flex-col gap-1 rounded-none text-destructive hover:text-destructive hover:bg-destructive/10"
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