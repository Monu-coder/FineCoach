import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Car, 
  ShoppingCart, 
  Coffee,
  Gamepad2,
  Trophy,
  Target,
  PiggyBank,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BudgetItem {
  id: string;
  name: string;
  category: 'need' | 'want';
  amount: number;
  icon: React.ReactNode;
  description: string;
}

interface InvestmentOption {
  id: string;
  name: string;
  risk: 'low' | 'medium' | 'high';
  expectedReturn: number;
  description: string;
  allocation: number;
}

export default function Game() {
  const { gameType } = useParams();
  const [, setLocation] = useLocation();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [gameStage, setGameStage] = useState<'intro' | 'playing' | 'results'>('intro');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Budget Simulator State
  const [monthlyIncome] = useState(4000);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', name: 'Rent', category: 'need', amount: 1200, icon: <Home className="w-5 h-5" />, description: 'Monthly housing cost' },
    { id: '2', name: 'Groceries', category: 'need', amount: 400, icon: <ShoppingCart className="w-5 h-5" />, description: 'Essential food items' },
    { id: '3', name: 'Car Payment', category: 'need', amount: 350, icon: <Car className="w-5 h-5" />, description: 'Transportation costs' },
    { id: '4', name: 'Utilities', category: 'need', amount: 150, icon: <Home className="w-5 h-5" />, description: 'Electricity, water, internet' },
    { id: '5', name: 'Dining Out', category: 'want', amount: 300, icon: <Coffee className="w-5 h-5" />, description: 'Restaurants and takeout' },
    { id: '6', name: 'Entertainment', category: 'want', amount: 200, icon: <Gamepad2 className="w-5 h-5" />, description: 'Movies, games, subscriptions' },
    { id: '7', name: 'Shopping', category: 'want', amount: 250, icon: <ShoppingCart className="w-5 h-5" />, description: 'Clothes and misc items' },
    { id: '8', name: 'Emergency Fund', category: 'need', amount: 300, icon: <PiggyBank className="w-5 h-5" />, description: 'Savings for unexpected expenses' }
  ]);

  // Investment Game State
  const [portfolio, setPortfolio] = useState<InvestmentOption[]>([
    { id: '1', name: 'Government Bonds', risk: 'low', expectedReturn: 3, description: 'Safe, guaranteed returns', allocation: 0 },
    { id: '2', name: 'Index Funds', risk: 'medium', expectedReturn: 7, description: 'Diversified market exposure', allocation: 0 },
    { id: '3', name: 'Growth Stocks', risk: 'high', expectedReturn: 12, description: 'High potential, high risk', allocation: 0 },
    { id: '4', name: 'Real Estate', risk: 'medium', expectedReturn: 9, description: 'Property investment', allocation: 0 },
    { id: '5', name: 'Cryptocurrency', risk: 'high', expectedReturn: 15, description: 'Volatile digital assets', allocation: 0 }
  ]);

  const [marketCondition, setMarketCondition] = useState<'bull' | 'bear' | 'stable'>('stable');
  const [investmentCapital] = useState(10000);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      setLocation("/onboarding");
      return;
    }
    setCurrentUserId(parseInt(userId));
  }, [setLocation]);

  const { data: user } = useQuery({
    queryKey: ["/api/users", currentUserId],
    enabled: !!currentUserId,
  });

  const submitGameScoreMutation = useMutation({
    mutationFn: async (gameData: any) => {
      const response = await apiRequest("POST", "/api/game-scores", gameData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "game-scores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId] });
    }
  });

  useEffect(() => {
    if (gameStage === 'playing' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStage === 'playing' && timeRemaining === 0) {
      finishGame();
    }
  }, [gameStage, timeRemaining]);

  const startGame = () => {
    setGameStage('playing');
    setTimeRemaining(gameType === 'budget-simulator' ? 900 : 1200); // 15 or 20 minutes
    
    if (gameType === 'investment-challenge') {
      // Randomly set market condition
      const conditions: ('bull' | 'bear' | 'stable')[] = ['bull', 'bear', 'stable'];
      setMarketCondition(conditions[Math.floor(Math.random() * conditions.length)]);
    }
  };

  const finishGame = () => {
    let finalScore = 0;
    
    if (gameType === 'budget-simulator') {
      finalScore = calculateBudgetScore();
    } else if (gameType === 'investment-challenge') {
      finalScore = calculateInvestmentScore();
    }
    
    setScore(finalScore);
    setGameStage('results');

    if (currentUserId) {
      submitGameScoreMutation.mutate({
        userId: currentUserId,
        gameType: gameType!,
        score: finalScore
      });

      toast({
        title: "Game Complete!",
        description: `You scored ${finalScore} points. Great job!`,
      });
    }
  };

  const calculateBudgetScore = (): number => {
    const totalExpenses = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    const savingsRate = (monthlyIncome - totalExpenses) / monthlyIncome;
    const emergencyFund = budgetItems.find(item => item.id === '8')?.amount || 0;
    
    let score = 0;
    
    // Savings rate scoring (0-40 points)
    if (savingsRate >= 0.2) score += 40;
    else if (savingsRate >= 0.15) score += 30;
    else if (savingsRate >= 0.1) score += 20;
    else if (savingsRate >= 0.05) score += 10;
    
    // Emergency fund scoring (0-30 points)
    if (emergencyFund >= 500) score += 30;
    else if (emergencyFund >= 300) score += 20;
    else if (emergencyFund >= 100) score += 10;
    
    // Balanced spending (0-30 points)
    const needsTotal = budgetItems.filter(item => item.category === 'need').reduce((sum, item) => sum + item.amount, 0);
    const wantsTotal = budgetItems.filter(item => item.category === 'want').reduce((sum, item) => sum + item.amount, 0);
    const needsRatio = needsTotal / totalExpenses;
    
    if (needsRatio >= 0.7 && needsRatio <= 0.8) score += 30;
    else if (needsRatio >= 0.6 && needsRatio <= 0.85) score += 20;
    else if (needsRatio >= 0.5 && needsRatio <= 0.9) score += 10;
    
    return Math.min(score * 10, 2500); // Scale to reasonable score
  };

  const calculateInvestmentScore = (): number => {
    const totalAllocation = portfolio.reduce((sum, investment) => sum + investment.allocation, 0);
    
    if (totalAllocation !== 100) return 0;
    
    let expectedReturn = 0;
    let riskScore = 0;
    
    portfolio.forEach(investment => {
      const weight = investment.allocation / 100;
      expectedReturn += investment.expectedReturn * weight;
      
      // Risk diversification scoring
      if (investment.risk === 'low' && investment.allocation > 0) riskScore += 10;
      if (investment.risk === 'medium' && investment.allocation > 0) riskScore += 15;
      if (investment.risk === 'high' && investment.allocation > 0) riskScore += 5;
    });
    
    // Market condition adjustments
    if (marketCondition === 'bull') {
      expectedReturn *= 1.2;
    } else if (marketCondition === 'bear') {
      expectedReturn *= 0.8;
    }
    
    // Diversification bonus
    const diversificationBonus = portfolio.filter(inv => inv.allocation > 0).length * 5;
    
    return Math.round((expectedReturn * 10) + riskScore + diversificationBonus);
  };

  const updateBudgetItem = (id: string, amount: number) => {
    setBudgetItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, amount } : item
      )
    );
  };

  const updateInvestmentAllocation = (id: string, allocation: number) => {
    setPortfolio(prev => 
      prev.map(investment => 
        investment.id === id ? { ...investment, allocation } : investment
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameTitle = () => {
    if (gameType === 'budget-simulator') return 'Budget Master';
    if (gameType === 'investment-challenge') return 'Investment Hero';
    return 'Financial Game';
  };

  const getGameGradient = () => {
    if (gameType === 'budget-simulator') return 'from-purple-500 to-pink-600';
    if (gameType === 'investment-challenge') return 'from-green-500 to-teal-600';
    return 'from-blue-500 to-indigo-600';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (gameStage === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className={`shadow-xl bg-gradient-to-br ${getGameGradient()} text-white`}>
            <CardHeader className="text-center p-8">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold mb-4">{getGameTitle()}</h1>
              <p className="text-xl text-white text-opacity-90">
                {gameType === 'budget-simulator' 
                  ? "Master the art of budgeting by allocating your monthly income wisely"
                  : "Build a diversified investment portfolio and maximize your returns"
                }
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <Target className="w-8 h-8 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Objective</h3>
                  <p className="text-white text-opacity-90">
                    {gameType === 'budget-simulator'
                      ? "Balance your needs and wants while maximizing savings and building an emergency fund."
                      : "Create a balanced portfolio that maximizes returns while managing risk effectively."
                    }
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <Trophy className="w-8 h-8 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Scoring</h3>
                  <p className="text-white text-opacity-90">
                    {gameType === 'budget-simulator'
                      ? "Points awarded for savings rate, emergency fund, and balanced spending between needs and wants."
                      : "Score based on expected returns, risk diversification, and portfolio balance."
                    }
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-3 font-semibold"
                >
                  Start Game
                </Button>
                <p className="text-white text-opacity-75 mt-3">
                  Time limit: {gameType === 'budget-simulator' ? '15' : '20'} minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameStage === 'results') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className={`bg-gradient-to-r ${getGameGradient()} text-white rounded-t-2xl p-8 text-center`}>
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold">Game Complete!</h2>
              <p className="text-white text-opacity-90">Congratulations on completing {getGameTitle()}</p>
            </CardHeader>
            
            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <div className="text-6xl font-bold text-primary mb-4">{score.toLocaleString()}</div>
                <p className="text-xl text-gray-600">Final Score</p>
              </div>

              {gameType === 'budget-simulator' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      ${(monthlyIncome - budgetItems.reduce((sum, item) => sum + item.amount, 0)).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Savings</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(((monthlyIncome - budgetItems.reduce((sum, item) => sum + item.amount, 0)) / monthlyIncome) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Savings Rate</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      ${budgetItems.find(item => item.id === '8')?.amount.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-gray-600">Emergency Fund</div>
                  </div>
                </div>
              )}

              {gameType === 'investment-challenge' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {portfolio.reduce((sum, inv) => sum + (inv.expectedReturn * inv.allocation / 100), 0).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Expected Return</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {portfolio.filter(inv => inv.allocation > 0).length}
                    </div>
                    <div className="text-sm text-gray-600">Asset Classes</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600 capitalize">
                      {marketCondition}
                    </div>
                    <div className="text-sm text-gray-600">Market Condition</div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button onClick={() => setLocation("/")} className="flex-1">
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                  className="flex-1"
                >
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Playing stage
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = monthlyIncome - totalBudget;
  const totalInvestmentAllocation = portfolio.reduce((sum, inv) => sum + inv.allocation, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className={`flex items-center space-x-4 bg-gradient-to-r ${getGameGradient()} text-white px-6 py-3 rounded-lg`}>
            <div className="text-lg font-semibold">{formatTime(timeRemaining)}</div>
            <div className="text-sm opacity-90">Time Remaining</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className={`bg-gradient-to-r ${getGameGradient()} text-white rounded-t-xl p-6`}>
                <h2 className="text-2xl font-bold">{getGameTitle()}</h2>
                <p className="text-white text-opacity-90">
                  {gameType === 'budget-simulator' 
                    ? `Monthly Income: $${monthlyIncome.toLocaleString()}`
                    : `Investment Capital: $${investmentCapital.toLocaleString()}`
                  }
                </p>
              </CardHeader>
              
              <CardContent className="p-6">
                {gameType === 'budget-simulator' && (
                  <div className="space-y-4">
                    {budgetItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {item.icon}
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.category === 'need' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.category === 'need' ? 'Need' : 'Want'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            value={[item.amount]}
                            onValueChange={(value) => updateBudgetItem(item.id, value[0])}
                            max={item.category === 'need' ? 2000 : 1000}
                            min={0}
                            step={25}
                            className="flex-1"
                          />
                          <div className="text-lg font-semibold min-w-[80px]">
                            ${item.amount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {gameType === 'investment-challenge' && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg mb-4 ${
                      marketCondition === 'bull' ? 'bg-green-50 border-green-200' :
                      marketCondition === 'bear' ? 'bg-red-50 border-red-200' :
                      'bg-blue-50 border-blue-200'
                    } border`}>
                      <div className="flex items-center space-x-2">
                        {marketCondition === 'bull' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                         marketCondition === 'bear' ? <TrendingDown className="w-5 h-5 text-red-600" /> :
                         <DollarSign className="w-5 h-5 text-blue-600" />}
                        <span className="font-semibold capitalize">{marketCondition} Market</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {marketCondition === 'bull' ? 'Stocks are performing well, higher returns expected' :
                         marketCondition === 'bear' ? 'Market is down, conservative approach recommended' :
                         'Market is stable, balanced approach works well'}
                      </p>
                    </div>

                    {portfolio.map((investment) => (
                      <div key={investment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{investment.name}</h3>
                            <p className="text-sm text-gray-600">{investment.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            investment.risk === 'low' ? 'bg-green-100 text-green-700' :
                            investment.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {investment.risk} risk • {investment.expectedReturn}% return
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            value={[investment.allocation]}
                            onValueChange={(value) => updateInvestmentAllocation(investment.id, value[0])}
                            max={100}
                            min={0}
                            step={5}
                            className="flex-1"
                          />
                          <div className="text-lg font-semibold min-w-[60px]">
                            {investment.allocation}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {gameType === 'budget-simulator' && (
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold">Budget Summary</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Monthly Income</span>
                    <span className="font-semibold text-green-600">${monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-semibold text-red-600">${totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span>Remaining</span>
                      <span className={`font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${remainingBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-2">Savings Rate</div>
                    <div className="text-2xl font-bold text-primary">
                      {remainingBudget >= 0 ? Math.round((remainingBudget / monthlyIncome) * 100) : 0}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {gameType === 'investment-challenge' && (
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold">Portfolio Summary</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Allocation</span>
                    <span className={`font-semibold ${totalInvestmentAllocation === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalInvestmentAllocation}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Return</span>
                    <span className="font-semibold text-primary">
                      {portfolio.reduce((sum, inv) => sum + (inv.expectedReturn * inv.allocation / 100), 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diversification</span>
                    <span className="font-semibold">
                      {portfolio.filter(inv => inv.allocation > 0).length} assets
                    </span>
                  </div>
                  
                  <Progress 
                    value={totalInvestmentAllocation} 
                    className={`h-3 ${totalInvestmentAllocation === 100 ? 'bg-green-100' : 'bg-red-100'}`}
                  />
                  
                  {totalInvestmentAllocation !== 100 && (
                    <p className="text-sm text-red-600">
                      Must allocate exactly 100% to complete
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={finishGame} 
              className="w-full bg-primary text-white hover:bg-blue-700 py-3"
              disabled={gameType === 'investment-challenge' && totalInvestmentAllocation !== 100}
            >
              Finish Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
