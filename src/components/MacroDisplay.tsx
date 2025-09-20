import { Progress } from "@/components/ui/progress";

interface MacroDisplayProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: 'primary' | 'accent' | 'destructive' | 'success';
}

export function MacroDisplay({ label, current, target, unit, color }: MacroDisplayProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'accent': return 'text-accent';
      case 'destructive': return 'text-destructive';
      case 'success': return 'text-success';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-card-foreground">{label}</span>
        <span className={`text-sm font-bold ${getColorClass(color)}`}>
          {current}{unit} / {target}{unit}
        </span>
      </div>
      <Progress 
        value={percentage} 
        variant={color}
        className="h-2"
      />
      <div className="text-xs text-muted-foreground">
        {Math.round(percentage)}% of daily target
      </div>
    </div>
  );
}