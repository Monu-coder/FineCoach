import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm FinBot. How can I help you with your financial learning today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    'credit-score': "Your credit score is affected by payment history (35%), credit utilization (30%), length of credit history (15%), credit mix (10%), and new credit inquiries (10%). Focus on paying bills on time and keeping your credit utilization below 30%.",
    'budgeting': "A great budgeting strategy is the 50/30/20 rule: allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment. Start by tracking your expenses for a month to understand your spending patterns.",
    'investing': "For beginners, consider starting with index funds or ETFs for diversification. Remember to invest regularly, think long-term, and only invest money you won't need for at least 5 years. The key is to start early and be consistent!",
    'emergency-fund': "An emergency fund should cover 3-6 months of living expenses. Start by saving $500, then gradually build up to the full amount. Keep it in a high-yield savings account for easy access.",
    'debt': "Focus on high-interest debt first (avalanche method) or start with smallest balances (snowball method). Consider debt consolidation if it lowers your interest rate. Most importantly, stop creating new debt while paying off existing debt."
  };

  const getDefaultResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('credit') || lowerMessage.includes('score')) {
      return botResponses['credit-score'];
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('money') || lowerMessage.includes('spend')) {
      return botResponses['budgeting'];
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('stock') || lowerMessage.includes('portfolio')) {
      return botResponses['investing'];
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('save')) {
      return botResponses['emergency-fund'];
    } else if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
      return botResponses['debt'];
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you with any financial questions you might have. You can ask me about credit scores, budgeting, investing, emergency funds, or debt management.";
    } else {
      return "That's a great question! While I have information about credit scores, budgeting, investing, emergency funds, and debt management, I'd recommend exploring our learning modules for more detailed information on that topic.";
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getDefaultResponse(content),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (questionType: string) => {
    const questionTexts = {
      'credit-score': 'How can I improve my credit score?',
      'budgeting': 'What are some good budgeting tips?',
      'investing': 'How should I start investing?'
    };

    const questionText = questionTexts[questionType as keyof typeof questionTexts];
    if (questionText) {
      sendMessage(questionText);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 left-0 w-80 shadow-2xl border border-gray-200 bg-white">
          <CardHeader className="bg-primary text-white rounded-t-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">FinBot</div>
                  <div className="text-blue-200 text-xs">Your financial assistant</div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    message.sender === 'bot' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.sender === 'bot' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  </div>
                  <div className={`rounded-lg px-3 py-2 max-w-xs text-sm ${
                    message.sender === 'bot'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-primary text-white'
                  }`}>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex space-x-2 mb-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about finance..."
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-white hover:bg-blue-700"
                  disabled={isTyping || !inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleQuickQuestion('credit-score')}
                >
                  Credit Score Help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleQuickQuestion('budgeting')}
                >
                  Budgeting Tips
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleQuickQuestion('investing')}
                >
                  Investment Basics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
