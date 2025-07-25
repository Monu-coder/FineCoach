import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getQuizQuestions, type QuizQuestion } from "@/lib/quiz-data";

interface QuizModalProps {
  module: string;
  userKnowledgeLevel: string;
  onClose: () => void;
  userId: number;
}

export default function QuizModal({ module, userKnowledgeLevel, onClose, userId }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitQuizMutation = useMutation({
    mutationFn: async (quizData: any) => {
      const response = await apiRequest("POST", "/api/quiz-attempts", quizData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "quiz-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId] });
    }
  });

  useEffect(() => {
    const quizQuestions = getQuizQuestions(module, userKnowledgeLevel.toLowerCase(), 5);
    setQuestions(quizQuestions);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
  }, [module, userKnowledgeLevel]);

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
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;

    const quizData = {
      userId,
      module,
      score: correctAnswers,
      totalQuestions: questions.length
    };

    submitQuizMutation.mutate(quizData);
    setShowResults(true);

    toast({
      title: "Quiz Complete!",
      description: `You scored ${correctAnswers}/${questions.length}. Points have been added to your account.`,
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

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader className="bg-primary text-white rounded-t-2xl p-6 text-center">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
              <p className="text-gray-600">You scored {correctAnswers} out of {questions.length} questions correctly</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {questions.map((question, index) => (
                <div key={question.id} className="text-left p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                  <p className={`text-sm ${
                    selectedAnswers[index] === question.correctAnswer 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    Your answer: {question.options[selectedAnswers[index]] || "Not answered"}
                  </p>
                  {selectedAnswers[index] !== question.correctAnswer && (
                    <p className="text-sm text-green-600">
                      Correct answer: {question.options[question.correctAnswer]}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">{question.explanation}</p>
                </div>
              ))}
            </div>

            <Button onClick={onClose} className="w-full">
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-primary text-white rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{getModuleTitle(module)} Quiz</h2>
              <p className="text-blue-200 text-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="bg-blue-700" />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-primary hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz-answer"
                    checked={selectedAnswers[currentQuestionIndex] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="text-primary"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="bg-primary text-white hover:bg-blue-700"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              {currentQuestionIndex !== questions.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
