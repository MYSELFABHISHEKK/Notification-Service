import { Notification, NotificationStatus, type User, type InsertUser } from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Notification methods
  createNotification(notification: Omit<Notification, "id" | "createdAt" | "updatedAt">): Promise<Notification>;
  getNotification(id: number): Promise<Notification | undefined>;
  getUserNotifications(userId: string, options?: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
  }): Promise<{ notifications: Notification[], total: number }>;
  updateNotificationStatus(id: number, status: NotificationStatus, deliveredAt?: Date): Promise<Notification | undefined>;
  incrementRetryCount(id: number): Promise<Notification | undefined>;
  getFailedNotifications(): Promise<Notification[]>;
  getStats(): Promise<{
    total: number;
    delivered: number;
    failed: number;
    pending: number;
    deliveryRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notifications: Map<number, Notification>;
  private userIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.notifications = new Map();
    this.userIdCounter = 1;
    this.notificationIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Notification methods
  async createNotification(notification: Omit<Notification, "id" | "createdAt" | "updatedAt">): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const newNotification: Notification = {
      id,
      ...notification,
      createdAt: now,
      updatedAt: now,
      deliveredAt: notification.status === NotificationStatus.DELIVERED ? now : null,
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getUserNotifications(userId: string, options: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
  } = {}): Promise<{ notifications: Notification[], total: number }> {
    const { limit = 10, offset = 0, status, type } = options;
    
    let filtered = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId);
    
    if (status) {
      filtered = filtered.filter(notification => notification.status === status);
    }
    
    if (type) {
      filtered = filtered.filter(notification => notification.type === type);
    }
    
    // Sort by createdAt in descending order (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const paged = filtered.slice(offset, offset + limit);
    
    return {
      notifications: paged,
      total: filtered.length
    };
  }

  async updateNotificationStatus(id: number, status: NotificationStatus, deliveredAt?: Date): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification: Notification = {
      ...notification,
      status,
      updatedAt: new Date(),
      deliveredAt: status === NotificationStatus.DELIVERED ? (deliveredAt || new Date()) : notification.deliveredAt,
    };
    
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async incrementRetryCount(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification: Notification = {
      ...notification,
      retryCount: notification.retryCount + 1,
      updatedAt: new Date(),
    };
    
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async getFailedNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.status === NotificationStatus.FAILED);
  }

  async getStats(): Promise<{
    total: number;
    delivered: number;
    failed: number;
    pending: number;
    deliveryRate: number;
  }> {
    const notifications = Array.from(this.notifications.values());
    const total = notifications.length;
    const delivered = notifications.filter(n => n.status === NotificationStatus.DELIVERED).length;
    const failed = notifications.filter(n => n.status === NotificationStatus.FAILED).length;
    const pending = notifications.filter(n => n.status === NotificationStatus.PENDING).length;
    
    const deliveryRate = total > 0 ? (delivered / total) * 100 : 0;
    
    return {
      total,
      delivered,
      failed,
      pending,
      deliveryRate: parseFloat(deliveryRate.toFixed(1))
    };
  }
}

export const storage = new MemStorage();
