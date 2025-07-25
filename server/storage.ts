import { users, userProgress, quizAttempts, gameScores, type User, type InsertUser, type UserProgress, type InsertUserProgress, type QuizAttempt, type InsertQuizAttempt, type GameScore, type InsertGameScore } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressByModule(userId: number, module: string): Promise<UserProgress | undefined>;
  upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Quiz methods
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: number): Promise<QuizAttempt[]>;
  getUserQuizAttemptsByModule(userId: number, module: string): Promise<QuizAttempt[]>;

  // Game methods
  createGameScore(score: InsertGameScore): Promise<GameScore>;
  getUserGameScores(userId: number): Promise<GameScore[]>;
  getUserBestGameScore(userId: number, gameType: string): Promise<GameScore | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProgress: Map<number, UserProgress>;
  private quizAttempts: Map<number, QuizAttempt>;
  private gameScores: Map<number, GameScore>;
  private currentUserId: number;
  private currentProgressId: number;
  private currentQuizId: number;
  private currentGameId: number;

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    this.quizAttempts = new Map();
    this.gameScores = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentQuizId = 1;
    this.currentGameId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      language: insertUser.language || "en",
      points: 0,
      level: 1,
      streak: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressByModule(userId: number, module: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      progress => progress.userId === userId && progress.module === module
    );
  }

  async upsertUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserProgressByModule(insertProgress.userId!, insertProgress.module);
    
    if (existing) {
      const updated: UserProgress = {
        ...existing,
        completedLessons: insertProgress.completedLessons || existing.completedLessons,
        lastAccessed: new Date(),
      };
      this.userProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentProgressId++;
      const progress: UserProgress = {
        ...insertProgress,
        id,
        userId: insertProgress.userId!,
        completedLessons: insertProgress.completedLessons || 0,
        lastAccessed: new Date(),
      };
      this.userProgress.set(id, progress);
      return progress;
    }
  }

  async createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.currentQuizId++;
    const attempt: QuizAttempt = {
      ...insertAttempt,
      id,
      userId: insertAttempt.userId!,
      completedAt: new Date(),
    };
    this.quizAttempts.set(id, attempt);
    return attempt;
  }

  async getUserQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(attempt => attempt.userId === userId);
  }

  async getUserQuizAttemptsByModule(userId: number, module: string): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(
      attempt => attempt.userId === userId && attempt.module === module
    );
  }

  async createGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = this.currentGameId++;
    const score: GameScore = {
      ...insertScore,
      id,
      userId: insertScore.userId!,
      completedAt: new Date(),
    };
    this.gameScores.set(id, score);
    return score;
  }

  async getUserGameScores(userId: number): Promise<GameScore[]> {
    return Array.from(this.gameScores.values()).filter(score => score.userId === userId);
  }

  async getUserBestGameScore(userId: number, gameType: string): Promise<GameScore | undefined> {
    const scores = Array.from(this.gameScores.values()).filter(
      score => score.userId === userId && score.gameType === gameType
    );
    return scores.reduce((best, current) => 
      !best || current.score > best.score ? current : best, 
      undefined as GameScore | undefined
    );
  }
}

export const storage = new MemStorage();
