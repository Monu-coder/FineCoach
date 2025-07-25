interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  en: {
    // Navigation & Layout
    'app.title': 'FinLearn',
    'nav.dashboard': 'Dashboard',
    'nav.modules': 'Learning Modules',
    'nav.games': 'Games',
    'nav.profile': 'Profile',
    
    // Onboarding
    'onboarding.title': 'Welcome to FinLearn!',
    'onboarding.subtitle': "Let's personalize your learning journey",
    'onboarding.username': 'Username',
    'onboarding.username.placeholder': 'Enter your username',
    'onboarding.email': 'Email',
    'onboarding.email.placeholder': 'Enter your email',
    'onboarding.language': 'Preferred Language',
    'onboarding.language.placeholder': 'Select your language',
    'onboarding.age': 'Age Group',
    'onboarding.age.placeholder': 'Select your age group',
    'onboarding.region': 'Region',
    'onboarding.region.placeholder': 'Select your region',
    'onboarding.goal': 'Financial Goal',
    'onboarding.goal.placeholder': 'Select your primary goal',
    'onboarding.knowledge': 'Current Knowledge Level',
    'onboarding.button': 'Start My Journey',
    'onboarding.creating': 'Creating Account...',
    
    // Dashboard
    'dashboard.greeting.morning': 'Good morning',
    'dashboard.greeting.afternoon': 'Good afternoon',
    'dashboard.greeting.evening': 'Good evening',
    'dashboard.subtitle': 'Ready to boost your financial knowledge today?',
    'dashboard.streak': 'day streak',
    'dashboard.level': 'Level',
    'dashboard.progress.overall': 'Overall Progress',
    'dashboard.progress.modules': 'modules in progress',
    'dashboard.thisweek': 'This Week',
    'dashboard.quizzes.completed': 'Quizzes completed',
    'dashboard.achievement': 'Achievement',
    'dashboard.points.total': 'Total points earned',
    'dashboard.modules.title': 'Learning Modules',
    'dashboard.modules.viewall': 'View All',
    'dashboard.games.title': 'Financial Games',
    'dashboard.games.playmore': 'Play More',
    'dashboard.quiz.title': "Today's Quick Quiz",
    'dashboard.quiz.subtitle': 'Test your knowledge and earn points',
    'dashboard.quiz.ready': 'Ready to test your financial knowledge?',
    'dashboard.quiz.start': 'Start Quick Quiz',
    'dashboard.regional.title': 'Regional Financial Insights',
    'dashboard.regional.savings': 'Average savings rate',
    'dashboard.regional.emergency': 'Avg. emergency fund',
    'dashboard.regional.investment': 'Investment participation',
    
    // Modules
    'module.creditcards.title': 'Credit Cards',
    'module.creditcards.description': 'Learn about responsible credit card usage, interest rates, and building credit history.',
    'module.investments.title': 'Investments',
    'module.investments.description': 'Understand different investment options, risk management, and portfolio diversification.',
    'module.savings.title': 'Savings & Budgeting',
    'module.savings.description': 'Master budgeting techniques, emergency funds, and smart saving strategies.',
    'module.status.notstarted': 'Not Started',
    'module.status.complete': 'Complete',
    'module.progress': 'Progress',
    'module.lessons': 'lessons',
    
    // Games
    'game.budget.title': 'Budget Master',
    'game.budget.description': 'Manage monthly expenses like a pro',
    'game.investment.title': 'Investment Hero',
    'game.investment.description': 'Build your portfolio strategically',
    'game.playnow': 'Play Now',
    'game.highscore': 'Your high score',
    
    // Quiz
    'quiz.title': 'Quiz',
    'quiz.question': 'Question',
    'quiz.of': 'of',
    'quiz.previous': 'Previous',
    'quiz.next': 'Next',
    'quiz.finish': 'Finish',
    'quiz.complete': 'Quiz Complete!',
    'quiz.score': 'You scored',
    'quiz.outof': 'out of',
    'quiz.correct': 'questions correctly',
    'quiz.continue': 'Continue Learning',
    'quiz.retake': 'Retake Quiz',
    'quiz.review': 'Review Your Answers',
    'quiz.youranswer': 'Your answer:',
    'quiz.correctanswer': 'Correct answer:',
    'quiz.notanswered': 'Not answered',
    
    // Chatbot
    'chatbot.title': 'FinBot',
    'chatbot.subtitle': 'Your financial assistant',
    'chatbot.placeholder': 'Ask me anything about finance...',
    'chatbot.welcome': "Hi! I'm FinBot. How can I help you with your financial learning today?",
    'chatbot.quickhelp.credit': 'Credit Score Help',
    'chatbot.quickhelp.budget': 'Budgeting Tips',
    'chatbot.quickhelp.investment': 'Investment Basics',
    
    // Common
    'common.points': 'points',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.complete': 'Complete',
    'common.start': 'Start',
    'common.finish': 'Finish',
    
    // Financial Goals
    'goal.emergency': 'Save for emergency fund',
    'goal.investing': 'Start investing',
    'goal.home': 'Buy a home',
    'goal.retirement': 'Retirement planning',
    'goal.debt': 'Debt management',
    
    // Knowledge Levels
    'knowledge.beginner': 'Beginner',
    'knowledge.intermediate': 'Intermediate',
    'knowledge.advanced': 'Advanced',
    
    // Age Groups
    'age.18-25': '18-25',
    'age.26-35': '26-35',
    'age.36-45': '36-45',
    'age.46+': '46+',
    
    // Regions
    'region.northamerica': 'North America',
    'region.europe': 'Europe',
    'region.asiapacific': 'Asia-Pacific',
    'region.latinamerica': 'Latin America',
    'region.africa': 'Africa',
    
    // Languages
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.hi': 'हिंदी',
    'language.ar': 'العربية'
  },
  
  es: {
    // Navigation & Layout
    'app.title': 'FinLearn',
    'nav.dashboard': 'Panel',
    'nav.modules': 'Módulos de Aprendizaje',
    'nav.games': 'Juegos',
    'nav.profile': 'Perfil',
    
    // Onboarding
    'onboarding.title': '¡Bienvenido a FinLearn!',
    'onboarding.subtitle': 'Personalicemos tu viaje de aprendizaje',
    'onboarding.username': 'Nombre de usuario',
    'onboarding.username.placeholder': 'Ingresa tu nombre de usuario',
    'onboarding.email': 'Correo electrónico',
    'onboarding.email.placeholder': 'Ingresa tu correo electrónico',
    'onboarding.language': 'Idioma Preferido',
    'onboarding.language.placeholder': 'Selecciona tu idioma',
    'onboarding.age': 'Grupo de Edad',
    'onboarding.age.placeholder': 'Selecciona tu grupo de edad',
    'onboarding.region': 'Región',
    'onboarding.region.placeholder': 'Selecciona tu región',
    'onboarding.goal': 'Meta Financiera',
    'onboarding.goal.placeholder': 'Selecciona tu meta principal',
    'onboarding.knowledge': 'Nivel de Conocimiento Actual',
    'onboarding.button': 'Comenzar Mi Viaje',
    'onboarding.creating': 'Creando Cuenta...',
    
    // Dashboard
    'dashboard.greeting.morning': 'Buenos días',
    'dashboard.greeting.afternoon': 'Buenas tardes',
    'dashboard.greeting.evening': 'Buenas noches',
    'dashboard.subtitle': '¿Listo para impulsar tu conocimiento financiero hoy?',
    'dashboard.streak': 'días seguidos',
    'dashboard.level': 'Nivel',
    'dashboard.progress.overall': 'Progreso General',
    'dashboard.progress.modules': 'módulos en progreso',
    'dashboard.thisweek': 'Esta Semana',
    'dashboard.quizzes.completed': 'Cuestionarios completados',
    'dashboard.achievement': 'Logro',
    'dashboard.points.total': 'Puntos totales obtenidos',
    'dashboard.modules.title': 'Módulos de Aprendizaje',
    'dashboard.modules.viewall': 'Ver Todo',
    'dashboard.games.title': 'Juegos Financieros',
    'dashboard.games.playmore': 'Jugar Más',
    'dashboard.quiz.title': 'Cuestionario Rápido de Hoy',
    'dashboard.quiz.subtitle': 'Pon a prueba tu conocimiento y gana puntos',
    'dashboard.quiz.ready': '¿Listo para probar tu conocimiento financiero?',
    'dashboard.quiz.start': 'Comenzar Cuestionario Rápido',
    'dashboard.regional.title': 'Perspectivas Financieras Regionales',
    'dashboard.regional.savings': 'Tasa promedio de ahorro',
    'dashboard.regional.emergency': 'Fondo de emergencia promedio',
    'dashboard.regional.investment': 'Participación en inversiones',
    
    // Languages
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.hi': 'हिंदी',
    'language.ar': 'العربية'
  },
  
  fr: {
    // Navigation & Layout
    'app.title': 'FinLearn',
    'nav.dashboard': 'Tableau de bord',
    'nav.modules': "Modules d'apprentissage",
    'nav.games': 'Jeux',
    'nav.profile': 'Profil',
    
    // Onboarding
    'onboarding.title': 'Bienvenue sur FinLearn!',
    'onboarding.subtitle': "Personnalisons votre parcours d'apprentissage",
    'onboarding.username': "Nom d'utilisateur",
    'onboarding.username.placeholder': "Entrez votre nom d'utilisateur",
    'onboarding.email': 'E-mail',
    'onboarding.email.placeholder': 'Entrez votre e-mail',
    'onboarding.language': 'Langue Préférée',
    'onboarding.language.placeholder': 'Sélectionnez votre langue',
    'onboarding.age': "Groupe d'âge",
    'onboarding.age.placeholder': "Sélectionnez votre groupe d'âge",
    'onboarding.region': 'Région',
    'onboarding.region.placeholder': 'Sélectionnez votre région',
    'onboarding.goal': 'Objectif Financier',
    'onboarding.goal.placeholder': 'Sélectionnez votre objectif principal',
    'onboarding.knowledge': 'Niveau de Connaissance Actuel',
    'onboarding.button': 'Commencer Mon Parcours',
    'onboarding.creating': 'Création du compte...',
    
    // Languages
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.hi': 'हिंदी',
    'language.ar': 'العربية'
  },
  
  hi: {
    // Navigation & Layout
    'app.title': 'FinLearn',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.modules': 'शिक्षा मॉड्यूल',
    'nav.games': 'खेल',
    'nav.profile': 'प्रोफाइल',
    
    // Onboarding
    'onboarding.title': 'FinLearn में आपका स्वागत है!',
    'onboarding.subtitle': 'आइए आपकी सीखने की यात्रा को व्यक्तिगत बनाते हैं',
    'onboarding.username': 'उपयोगकर्ता नाम',
    'onboarding.username.placeholder': 'अपना उपयोगकर्ता नाम दर्ज करें',
    'onboarding.email': 'ईमेल',
    'onboarding.email.placeholder': 'अपना ईमेल दर्ज करें',
    'onboarding.language': 'पसंदीदा भाषा',
    'onboarding.language.placeholder': 'अपनी भाषा चुनें',
    'onboarding.age': 'आयु समूह',
    'onboarding.age.placeholder': 'अपना आयु समूह चुनें',
    'onboarding.region': 'क्षेत्र',
    'onboarding.region.placeholder': 'अपना क्षेत्र चुनें',
    'onboarding.goal': 'वित्तीय लक्ष्य',
    'onboarding.goal.placeholder': 'अपना मुख्य लक्ष्य चुनें',
    'onboarding.knowledge': 'वर्तमान ज्ञान स्तर',
    'onboarding.button': 'मेरी यात्रा शुरू करें',
    'onboarding.creating': 'खाता बनाया जा रहा है...',
    
    // Languages
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.hi': 'हिंदी',
    'language.ar': 'العربية'
  }
};

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
];

export function getTranslation(language: string, key: string): string {
  return translations[language]?.[key] || translations['en'][key] || key;
}

export function getLanguageName(langCode: string): string {
  const lang = supportedLanguages.find(l => l.code === langCode);
  return lang?.nativeName || langCode;
}