# Financial Learning Platform

## Overview

This is a gamified financial education platform that helps users learn about personal finance through interactive modules, quizzes, games, and progress tracking. The application is built as a full-stack web application with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Shadcn/UI components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple
- **Development Server**: Uses Vite middleware in development for hot reloading
- **API Design**: RESTful API with JSON responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for testing/development

## Key Components

### Core Features
1. **User Management**: Registration, profiles with personalized learning paths
2. **Learning Modules**: Three main areas - Credit Cards, Investments, and Savings
3. **Interactive Quizzes**: Adaptive difficulty based on user knowledge level
4. **Gamification**: Budget simulator and investment challenge games
5. **Progress Tracking**: User progress, streaks, points, and levels
6. **AI Chatbot**: FinBot for answering financial questions
7. **Regional Data**: Localized financial statistics and benchmarks

### Frontend Components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Component Library**: Comprehensive UI components for forms, modals, cards, progress indicators
- **Real-time Features**: Live chat interface and interactive games
- **Accessibility**: ARIA-compliant components with keyboard navigation

### Backend Services
- **Authentication**: User creation and retrieval by ID or email
- **Progress Management**: Module completion tracking and quiz attempt history
- **Game Scoring**: High score tracking for different game types
- **Data Aggregation**: Regional statistics and user analytics

## Data Flow

### User Journey
1. **Onboarding**: New users complete a profile setup with age, region, financial goals, and knowledge level
2. **Dashboard**: Personalized view showing progress, available modules, games, and achievements
3. **Learning**: Users progress through modules, take quizzes, and play games
4. **Tracking**: System records all activities, scores, and progress updates

### API Patterns
- RESTful endpoints for CRUD operations on users, progress, quizzes, and games
- Consistent error handling with appropriate HTTP status codes
- JSON request/response format with TypeScript validation using Zod schemas

### Database Schema
- **Users**: Core user information, points, levels, and streaks
- **User Progress**: Module-specific progress tracking
- **Quiz Attempts**: Historical quiz performance data
- **Game Scores**: High scores for different game types

## External Dependencies

### Core Libraries
- **UI Framework**: React, Radix UI, Tailwind CSS
- **Database**: Drizzle ORM, @neondatabase/serverless, PostgreSQL
- **Validation**: Zod for schema validation
- **State Management**: TanStack Query for API state
- **Routing**: Wouter for lightweight client-side routing

### Development Tools
- **Build System**: Vite with TypeScript support
- **Code Quality**: ESBuild for production builds
- **Development**: Hot module replacement and runtime error overlay

### Third-party Integrations
- **Database Hosting**: Neon serverless PostgreSQL
- **Replit Integration**: Development environment optimizations
- **Form Handling**: React Hook Form with resolvers

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Full-stack hot reloading with Vite middleware
- **Database**: Environment-based configuration with DATABASE_URL

### Production Build
- **Frontend**: Static assets built to `dist/public`
- **Backend**: Node.js server compiled with ESBuild
- **Database**: PostgreSQL migrations managed by Drizzle Kit
- **Environment**: Production-ready Express server with static file serving

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **Build Scripts**: Separate development and production configurations
- **Type Safety**: Full TypeScript coverage across frontend and backend

### Scalability Considerations
- **Database**: Serverless PostgreSQL with connection pooling
- **State Management**: Optimistic updates and caching strategies
- **Performance**: Code splitting and lazy loading for frontend components