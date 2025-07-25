import { Card, CardContent } from "@/components/ui/card";

interface ProgressCardProps {
  title: string;
  icon: React.ReactNode;
  progress: number;
  description: string;
}

export default function ProgressCard({ title, icon, progress, description }: ProgressCardProps) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {icon}
        </div>
        <div className="relative w-20 h-20 mx-auto mb-4">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle 
              cx="40" 
              cy="40" 
              r="36" 
              stroke="#E5E7EB" 
              strokeWidth="8" 
              fill="none"
            />
            <circle 
              cx="40" 
              cy="40" 
              r="36" 
              stroke="hsl(221.2, 83.2%, 53.3%)" 
              strokeWidth="8" 
              fill="none" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{progress}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  );
}
