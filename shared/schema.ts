import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Notification schema
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // "email", "sms", "in-app"
  title: text("title").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull(), // "pending", "delivered", "failed"
  priority: boolean("priority").default(false),
  retryCount: integer("retry_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deliveredAt: timestamp("delivered_at"),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deliveredAt: true,
  retryCount: true,
  status: true,
});

export const sendNotificationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.enum(["email", "sms", "in-app"], {
    errorMap: () => ({ message: "Type must be email, sms, or in-app" }),
  }),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  priority: z.boolean().optional().default(false),
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type SendNotification = z.infer<typeof sendNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Notification status enum
export enum NotificationStatus {
  PENDING = "pending",
  DELIVERED = "delivered",
  FAILED = "failed",
}

// Notification type enum
export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  IN_APP = "in-app",
}
