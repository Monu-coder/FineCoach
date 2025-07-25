import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, PiggyBank } from "lucide-react";
import type { UserProgress } from "@shared/schema";

interface ModuleCardProps {
  module: string;
  title: string;
  description: string;
  icon: string;
  progress?: UserProgress;
  onOpenModule: (module: string) => void;
}

const iconMap = {
  "credit-card": CreditCard,
  "chart-line": TrendingUp,
  "piggy-bank": PiggyBank,
};

const colorMap = {
  "credit-cards": "bg-red-100 text-red-600",
  "investments": "bg-green-100 text-green-600",
  "savings": "bg-blue-100 text-blue-600",
};

export default function ModuleCard({ module, title, description, icon, progress, onOpenModule }: ModuleCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || CreditCard;
  const iconColorClass = colorMap[module as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
  
  const completedLessons = progress?.completedLessons || 0;
  const totalLessons = progress?.totalLessons || 8;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  const getStatusBadge = () => {
    if (progressPercentage === 0) return { text: "Not Started", className: "bg-gray-300 text-gray-700" };
    if (progressPercentage === 100) return { text: "Complete", className: "bg-green-500 text-white" };
    if (progressPercentage >= 75) return { text: `${progressPercentage}% Complete`, className: "bg-secondary text-white" };
    return { text: `${progressPercentage}% Complete`, className: "bg-accent text-white" };
  };

  const statusBadge = getStatusBadge();

  return (
    <Card 
      className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onOpenModule(module)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`rounded-lg p-3 ${iconColorClass}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <Badge className={`text-xs px-2 py-1 rounded-full ${statusBadge.className}`}>
            {statusBadge.text}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900 font-medium">{completedLessons}/{totalLessons} lessons</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: progressPercentage === 0 ? '#9CA3AF' : 
                               progressPercentage >= 75 ? 'hsl(142.1, 76.2%, 36.3%)' : 
                               'hsl(38.3, 92.6%, 50.2%)'
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
