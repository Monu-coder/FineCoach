export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const quizData: Record<string, QuizQuestion[]> = {
  'credit-cards': [
    {
      id: 'cc1',
      question: 'What factor has the biggest impact on your credit score?',
      options: [
        'Payment history (35%)',
        'Credit utilization (30%)',
        'Length of credit history (15%)',
        'Types of credit accounts (10%)'
      ],
      correctAnswer: 0,
      explanation: 'Payment history accounts for 35% of your credit score and is the most important factor.',
      difficulty: 'beginner'
    },
    {
      id: 'cc2',
      question: 'What is considered a good credit utilization ratio?',
      options: ['Below 30%', 'Below 50%', 'Below 70%', 'Below 90%'],
      correctAnswer: 0,
      explanation: 'Keeping your credit utilization below 30% is recommended for maintaining a good credit score.',
      difficulty: 'beginner'
    },
    {
      id: 'cc3',
      question: 'How long do negative marks typically stay on your credit report?',
      options: ['3 years', '5 years', '7 years', '10 years'],
      correctAnswer: 2,
      explanation: 'Most negative marks stay on your credit report for 7 years, though some bankruptcies can stay for 10 years.',
      difficulty: 'intermediate'
    },
    {
      id: 'cc4',
      question: 'What is the difference between a charge card and a credit card?',
      options: [
        'Charge cards must be paid in full each month',
        'Credit cards have higher interest rates',
        'Charge cards have spending limits',
        'There is no difference'
      ],
      correctAnswer: 0,
      explanation: 'Charge cards require the full balance to be paid each month, while credit cards allow you to carry a balance.',
      difficulty: 'advanced'
    }
  ],
  'investments': [
    {
      id: 'inv1',
      question: 'What is diversification in investing?',
      options: [
        'Investing in only one type of asset',
        'Spreading investments across different assets',
        'Only investing in stocks',
        'Keeping all money in savings'
      ],
      correctAnswer: 1,
      explanation: 'Diversification means spreading your investments across different asset classes to reduce risk.',
      difficulty: 'beginner'
    },
    {
      id: 'inv2',
      question: 'What does P/E ratio stand for?',
      options: ['Price/Earnings', 'Profit/Equity', 'Price/Equity', 'Profit/Earnings'],
      correctAnswer: 0,
      explanation: 'P/E ratio stands for Price-to-Earnings ratio, which compares a company\'s stock price to its earnings per share.',
      difficulty: 'intermediate'
    },
    {
      id: 'inv3',
      question: 'What is compound interest?',
      options: [
        'Interest paid only on the principal',
        'Interest paid on principal and accumulated interest',
        'A type of investment fee',
        'Interest that decreases over time'
      ],
      correctAnswer: 1,
      explanation: 'Compound interest is interest calculated on both the initial principal and accumulated interest from previous periods.',
      difficulty: 'beginner'
    },
    {
      id: 'inv4',
      question: 'What is a bear market?',
      options: [
        'A market with rising prices',
        'A market with falling prices of 20% or more',
        'A market with stable prices',
        'A market for trading animal stocks'
      ],
      correctAnswer: 1,
      explanation: 'A bear market is characterized by falling stock prices of 20% or more from recent highs.',
      difficulty: 'intermediate'
    }
  ],
  'savings': [
    {
      id: 'sav1',
      question: 'What is the recommended emergency fund size for most people?',
      options: [
        '1-2 months of expenses',
        '3-6 months of expenses',
        '1 year of expenses',
        '2 years of expenses'
      ],
      correctAnswer: 1,
      explanation: 'Financial experts typically recommend having 3-6 months of living expenses saved for emergencies.',
      difficulty: 'beginner'
    },
    {
      id: 'sav2',
      question: 'What is the 50/30/20 budgeting rule?',
      options: [
        '50% needs, 30% wants, 20% savings',
        '50% savings, 30% needs, 20% wants',
        '50% wants, 30% needs, 20% savings',
        '50% investments, 30% savings, 20% spending'
      ],
      correctAnswer: 0,
      explanation: 'The 50/30/20 rule suggests allocating 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
      difficulty: 'beginner'
    },
    {
      id: 'sav3',
      question: 'What type of account typically offers the highest interest rates for savings?',
      options: [
        'Traditional savings account',
        'Checking account',
        'High-yield savings account',
        'Certificate of deposit (CD)'
      ],
      correctAnswer: 3,
      explanation: 'CDs typically offer the highest interest rates among savings options, but require you to lock up your money for a specific term.',
      difficulty: 'intermediate'
    },
    {
      id: 'sav4',
      question: 'What is the purpose of an emergency fund?',
      options: [
        'To invest in the stock market',
        'To cover unexpected expenses',
        'To buy luxury items',
        'To lend money to friends'
      ],
      correctAnswer: 1,
      explanation: 'An emergency fund is designed to cover unexpected expenses like job loss, medical bills, or major repairs.',
      difficulty: 'beginner'
    }
  ]
};

export function getQuizQuestions(module: string, knowledgeLevel: string, count: number = 5): QuizQuestion[] {
  const moduleQuestions = quizData[module] || [];
  
  // Filter questions based on knowledge level
  let filteredQuestions = moduleQuestions;
  if (knowledgeLevel === 'beginner') {
    filteredQuestions = moduleQuestions.filter(q => q.difficulty === 'beginner');
  } else if (knowledgeLevel === 'intermediate') {
    filteredQuestions = moduleQuestions.filter(q => ['beginner', 'intermediate'].includes(q.difficulty));
  }
  
  // Shuffle and return requested count
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
