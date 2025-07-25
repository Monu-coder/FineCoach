import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getQuizQuestions, type QuizQuestion } from "@/lib/quiz-data";

export default function Quiz() {
  const { module } = useParams();
  const [, setLocation] = useLocation();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const submitQuizMutation = useMutation({
    mutationFn: async (quizData: any) => {
      const response = await apiRequest("POST", "/api/quiz-attempts", quizData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "quiz-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId] });
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      const response = await apiRequest("POST", "/api/progress", progressData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "progress"] });
    }
  });

  useEffect(() => {
    if (user && module) {
      const quizQuestions = getQuizQuestions(module, user.knowledgeLevel.toLowerCase(), 10);
      setQuestions(quizQuestions);
      setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
    }
  }, [user, module]);

  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleFinishQuiz();
    }
  }, [timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    if (!currentUserId) return;
    
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;

    const quizData = {
      userId: currentUserId,
      module: module!,
      score: correctAnswers,
      totalQuestions: questions.length
    };

    submitQuizMutation.mutate(quizData);
    
    // Update module progress
    const progressData = {
      userId: currentUserId,
      module: module!,
      completedLessons: Math.min(correctAnswers + 2, 8), // Simulate lesson completion
      totalLessons: 8
    };
    
    updateProgressMutation.mutate(progressData);
    setShowResults(true);

    toast({
      title: "Quiz Complete!",
      description: `You scored ${correctAnswers}/${questions.length}. Great job!`,
    });
  };

  const getModuleTitle = (module: string) => {
    const titles = {
      'credit-cards': 'Credit Cards',
      'investments': 'Investments',
      'savings': 'Savings & Budgeting'
    };
    return titles[module as keyof typeof titles] || 'Quiz';
  };

  if (!user || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-primary text-white rounded-t-2xl p-6 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold">Quiz Complete!</h2>
              <p className="text-blue-200">Well done on completing the {getModuleTitle(module!)} quiz</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-primary mb-2">{percentage}%</div>
                <p className="text-xl text-gray-600 mb-4">You scored {correctAnswers} out of {questions.length} questions correctly</p>
                
                <div className="flex justify-center space-x-8 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{questions.length - correctAnswers}</div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">+{Math.floor((correctAnswers / questions.length) * 100)}</div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold mb-4">Review Your Answers</h3>
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                    <div className="mb-2">
                      <p className={`text-sm ${
                        selectedAnswers[index] === question.correctAnswer 
                          ? 'text-green-600 font-medium' 
                          : 'text-red-600'
                      }`}>
                        Your answer: {question.options[selectedAnswers[index]] || "Not answered"}
                      </p>
                      {selectedAnswers[index] !== question.correctAnswer && (
                        <p className="text-sm text-green-600 font-medium">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 bg-white p-2 rounded">{question.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => setLocation("/")} className="flex-1">
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                  className="flex-1"
                >
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-primary text-white rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{getModuleTitle(module!)} Quiz</h2>
                <p className="text-blue-200">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-blue-200">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-mono">{formatTime(timeRemaining)}</span>
              </div>
            </div>
            <Progress value={progress} className="bg-blue-700 h-3" />
          </CardHeader>

          <CardContent className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.question}
              </h3>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-primary bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-primary hover:bg-blue-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz-answer"
                      checked={selectedAnswers[currentQuestionIndex] === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="text-primary scale-125"
                    />
                    <span className="text-gray-700 text-lg">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Difficulty</div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="bg-primary text-white hover:bg-blue-700 px-6 py-3"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                {currentQuestionIndex !== questions.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
