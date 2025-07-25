import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema, insertQuizAttemptSchema, insertGameScoreSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  app.get("/api/users/email/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid email" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  app.get("/api/users/:userId/progress/:module", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const module = req.params.module;
      const progress = await storage.getUserProgressByModule(userId, module);
      res.json(progress || null);
    } catch (error) {
      res.status(400).json({ error: "Invalid parameters" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.upsertUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  // Quiz routes
  app.post("/api/quiz-attempts", async (req, res) => {
    try {
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt(attemptData);
      
      // Update user points and progress
      const user = await storage.getUser(attemptData.userId!);
      if (user) {
        const pointsEarned = Math.floor((attemptData.score / attemptData.totalQuestions) * 100);
        await storage.updateUser(user.id, { points: user.points! + pointsEarned });
      }
      
      res.json(attempt);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz attempt data" });
    }
  });

  app.get("/api/users/:userId/quiz-attempts", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const attempts = await storage.getUserQuizAttempts(userId);
      res.json(attempts);
    } catch (error) {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  app.get("/api/users/:userId/quiz-attempts/:module", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const module = req.params.module;
      const attempts = await storage.getUserQuizAttemptsByModule(userId, module);
      res.json(attempts);
    } catch (error) {
      res.status(400).json({ error: "Invalid parameters" });
    }
  });

  // Game routes
  app.post("/api/game-scores", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      const gameScore = await storage.createGameScore(scoreData);
      
      // Update user points
      const user = await storage.getUser(scoreData.userId!);
      if (user) {
        const pointsEarned = Math.floor(scoreData.score / 10);
        await storage.updateUser(user.id, { points: user.points! + pointsEarned });
      }
      
      res.json(gameScore);
    } catch (error) {
      res.status(400).json({ error: "Invalid game score data" });
    }
  });

  app.get("/api/users/:userId/game-scores", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const scores = await storage.getUserGameScores(userId);
      res.json(scores);
    } catch (error) {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  app.get("/api/users/:userId/game-scores/:gameType/best", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const gameType = req.params.gameType;
      const bestScore = await storage.getUserBestGameScore(userId, gameType);
      res.json(bestScore || null);
    } catch (error) {
      res.status(400).json({ error: "Invalid parameters" });
    }
  });

  // Regional data route
  app.get("/api/regional-data/:region", async (req, res) => {
    const region = req.params.region;
    const regionalData = {
      "north-america": {
        averageSavingsRate: "4.2%",
        averageEmergencyFund: "$3,200",
        investmentParticipation: "28%"
      },
      "europe": {
        averageSavingsRate: "5.8%",
        averageEmergencyFund: "€2,800",
        investmentParticipation: "35%"
      },
      "asia-pacific": {
        averageSavingsRate: "8.1%",
        averageEmergencyFund: "¥180,000",
        investmentParticipation: "22%"
      },
      "latin-america": {
        averageSavingsRate: "3.5%",
        averageEmergencyFund: "$1,800",
        investmentParticipation: "15%"
      },
      "africa": {
        averageSavingsRate: "6.2%",
        averageEmergencyFund: "$1,200",
        investmentParticipation: "12%"
      }
    };

    const data = regionalData[region.toLowerCase() as keyof typeof regionalData];
    if (!data) {
      return res.status(404).json({ error: "Regional data not found" });
    }
    
    res.json(data);
  });

  const httpServer = createServer(app);
  return httpServer;
}
