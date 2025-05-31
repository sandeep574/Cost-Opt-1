import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOptimizationRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create optimization request
  app.post("/api/optimize", async (req, res) => {
    try {
      const validatedData = insertOptimizationRequestSchema.parse(req.body);
      const result = await storage.createOptimizationRequest(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get optimization result
  app.get("/api/optimize/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }

      const result = await storage.getOptimizationRequest(id);
      if (!result) {
        res.status(404).json({ message: "Optimization request not found" });
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Real-time optimization analysis (for live updates as user types)
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedData = insertOptimizationRequestSchema.parse(req.body);
      const result = await storage.optimizeConfiguration(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
