import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Clock, Trophy } from "lucide-react";

interface GameCardProps {
  gameType: string;
  title: string;
  description: string;
  gradient: string;
  onPlayGame: (gameType: string) => void;
}

export default function GameCard({ gameType, title, description, gradient, onPlayGame }: GameCardProps) {
  const getGameDetails = () => {
    switch (gameType) {
      case 'budget-simulator':
        return { time: '15 min', difficulty: 'Easy', highScore: '$2,350' };
      case 'investment-challenge':
        return { time: '20 min', difficulty: 'Medium', highScore: '+18.5%' };
      default:
        return { time: '10 min', difficulty: 'Easy', highScore: '0' };
    }
  };

  const gameDetails = getGameDetails();

  return (
    <Card className={`bg-gradient-to-br ${gradient} text-white relative overflow-hidden group cursor-pointer`}>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-white text-opacity-80 text-sm">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">{gameDetails.highScore}</div>
            <div className="text-white text-opacity-80 text-sm">Your high score</div>
          </div>
          <Button 
            className="bg-white text-gray-900 hover:bg-gray-100 transition-colors font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onPlayGame(gameType);
            }}
          >
            Play Now
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-white text-opacity-80">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {gameDetails.time}
          </span>
          <span className="flex items-center">
            <Trophy className="w-4 h-4 mr-1" />
            {gameDetails.difficulty}
          </span>
        </div>
      </CardContent>
      
      {/* Decorative element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white bg-opacity-10 rounded-full transform group-hover:scale-110 transition-transform duration-300" />
    </Card>
  );
}
