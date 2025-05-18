import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import notificationService from "./services/notificationService";
import { sendNotificationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route prefix
  const apiRoute = "/api";

  // Create notification endpoint
  app.post(`${apiRoute}/notifications`, async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = sendNotificationSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationError.details 
        });
      }
      
      // Create and process notification
      const notification = await notificationService.sendNotification(result.data);
      
      // Return created notification
      return res.status(201).json({
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        status: notification.status,
        createdAt: notification.createdAt
      });
    } catch (error: any) {
      console.error("Error creating notification:", error);
      return res.status(500).json({ message: "Failed to create notification" });
    }
  });

  // Get user notifications endpoint
  app.get(`${apiRoute}/users/:userId/notifications`, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { limit, offset, status, type } = req.query;
      
      // Parse query parameters
      const options = {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        status: status as string | undefined,
        type: type as string | undefined
      };
      
      // Get notifications for user
      const result = await storage.getUserNotifications(userId, options);
      
      // Return notifications
      return res.status(200).json({
        notifications: result.notifications,
        total: result.total,
        limit: options.limit || 10,
        offset: options.offset || 0
      });
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Get notification stats endpoint
  app.get(`${apiRoute}/notifications/stats`, async (_req: Request, res: Response) => {
    try {
      // Get notification statistics
      const stats = await storage.getStats();
      
      // Return statistics
      return res.status(200).json(stats);
    } catch (error: any) {
      console.error("Error fetching notification stats:", error);
      return res.status(500).json({ message: "Failed to fetch notification statistics" });
    }
  });

  // Retry a failed notification
  app.post(`${apiRoute}/notifications/:id/retry`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get notification
      const notification = await storage.getNotification(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      // Check if notification is failed
      if (notification.status !== "failed") {
        return res.status(400).json({ message: "Only failed notifications can be retried" });
      }
      
      // Update status to pending
      await storage.updateNotificationStatus(id, "pending");
      
      // Process notification
      const updated = await storage.getNotification(id);
      if (updated) {
        notificationService.sendNotification({
          userId: updated.userId,
          type: updated.type as any,
          title: updated.title,
          message: updated.message,
          priority: updated.priority
        });
      }
      
      return res.status(200).json({ message: "Notification retry initiated" });
    } catch (error: any) {
      console.error("Error retrying notification:", error);
      return res.status(500).json({ message: "Failed to retry notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
