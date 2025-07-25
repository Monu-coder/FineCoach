import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Coins, Flame, Trophy, ChartLine, Calendar, Medal, Globe } from "lucide-react";
import Chatbot from "@/components/chatbot";
import ProgressCard from "@/components/progress-card";
import ModuleCard from "@/components/module-card";
import GameCard from "@/components/game-card";
import QuizModal from "@/components/quiz-modal";
import { getRegionalKey } from "@/lib/regional-data";
import type { User, UserProgress } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      setLocation("/onboarding");
      return;
    }
    setCurrentUserId(parseInt(userId));
  }, [setLocation]);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users", currentUserId],
    enabled: !!currentUserId,
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/users", currentUserId, "progress"],
    enabled: !!currentUserId,
  });

  const { data: regionalData } = useQuery({
    queryKey: ["/api/regional-data", user?.region ? getRegionalKey(user.region) : ""],
    enabled: !!user?.region,
  });

  const { data: quizAttempts } = useQuery({
    queryKey: ["/api/users", currentUserId, "quiz-attempts"],
    enabled: !!currentUserId,
  });

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const openModuleQuiz = (module: string) => {
    setSelectedModule(module);
    setShowQuizModal(true);
  };

  const openModule = (module: string) => {
    setLocation(`/quiz/${module}`);
  };

  const openGame = (gameType: string) => {
    setLocation(`/game/${gameType}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const calculateOverallProgress = () => {
    if (!userProgress || userProgress.length === 0) return 0;
    const totalProgress = userProgress.reduce((sum: number, progress: any) => {
      return sum + (progress.completedLessons / progress.totalLessons) * 100;
    }, 0);
    return Math.round(totalProgress / userProgress.length);
  };

  const weeklyQuizzes = quizAttempts?.filter((attempt: any) => {
    const attemptDate = new Date(attempt.completedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return attemptDate >= weekAgo;
  }).length || 0;

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-white rounded-lg p-2">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-primary">FinLearn</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-amber-50 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{user.points?.toLocaleString() || 0} points</span>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {getGreeting()}, {user.username}!
                </h2>
                <p className="text-blue-100 mb-4">Ready to boost your financial knowledge today?</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-amber-300" />
                    <span className="font-medium">{user.streak || 0} day streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span className="font-medium">Level {user.level || 1}</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <ChartLine className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ProgressCard
            title="Overall Progress"
            icon={<ChartLine className="w-5 h-5 text-primary" />}
            progress={overallProgress}
            description={`${userProgress?.length || 0} modules in progress`}
          />

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">This Week</h3>
                <Calendar className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">{weeklyQuizzes}</div>
              <p className="text-sm text-gray-600">Quizzes completed</p>
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((weeklyQuizzes / 10) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Achievement</h3>
                <Medal className="w-5 h-5 text-accent" />
              </div>
              <div className="text-3xl font-bold text-accent mb-2">
                {user.points?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-600">Total points earned</p>
              <div className="mt-4 flex space-x-1">
                {Array.from({ length: Math.min(Math.floor((user.points || 0) / 500), 5) }, (_, i) => (
                  <div key={i} className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Modules</h2>
            <Button variant="ghost" className="text-primary hover:text-blue-700 font-medium">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard
              module="credit-cards"
              title="Credit Cards"
              description="Learn about responsible credit card usage, interest rates, and building credit history."
              icon="credit-card"
              progress={userProgress?.find((p: any) => p.module === 'credit-cards')}
              onOpenModule={openModule}
            />
            
            <ModuleCard
              module="investments"
              title="Investments"
              description="Understand different investment options, risk management, and portfolio diversification."
              icon="chart-line"
              progress={userProgress?.find((p: any) => p.module === 'investments')}
              onOpenModule={openModule}
            />
            
            <ModuleCard
              module="savings"
              title="Savings & Budgeting"
              description="Master budgeting techniques, emergency funds, and smart saving strategies."
              icon="piggy-bank"
              progress={userProgress?.find((p: any) => p.module === 'savings')}
              onOpenModule={openModule}
            />
          </div>
        </div>

        {/* Interactive Games */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial Games</h2>
            <Button variant="ghost" className="text-primary hover:text-blue-700 font-medium">
              Play More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameCard
              gameType="budget-simulator"
              title="Budget Master"
              description="Manage monthly expenses like a pro"
              gradient="from-purple-500 to-pink-600"
              onPlayGame={openGame}
            />
            
            <GameCard
              gameType="investment-challenge"
              title="Investment Hero"
              description="Build your portfolio strategically"
              gradient="from-green-500 to-teal-600"
              onPlayGame={openGame}
            />
          </div>
        </div>

        {/* Quick Quiz Section */}
        <div className="mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Today's Quick Quiz</h2>
                  <p className="text-gray-600 text-sm">Test your knowledge and earn points</p>
                </div>
                <div className="bg-accent text-white rounded-lg p-3">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Ready to test your financial knowledge?</p>
                <Button 
                  onClick={() => openModuleQuiz('credit-cards')} 
                  className="bg-primary text-white hover:bg-blue-700"
                >
                  Start Quick Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Insights */}
        {regionalData && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Regional Financial Insights</h2>
                  <p className="text-indigo-100 text-sm">{user.region}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">{regionalData.averageSavingsRate}</div>
                  <div className="text-indigo-200 text-sm">Average savings rate</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">{regionalData.averageEmergencyFund}</div>
                  <div className="text-indigo-200 text-sm">Avg. emergency fund</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">{regionalData.investmentParticipation}</div>
                  <div className="text-indigo-200 text-sm">Investment participation</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Chatbot />

      {showQuizModal && (
        <QuizModal
          module={selectedModule}
          userKnowledgeLevel={user.knowledgeLevel}
          onClose={() => setShowQuizModal(false)}
          userId={currentUserId!}
        />
      )}
    </div>
  );
}
