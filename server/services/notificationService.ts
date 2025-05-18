import { Notification, NotificationStatus, NotificationType, SendNotification } from "@shared/schema";
import { storage } from "../storage";
import emailService from "./emailService";
import smsService from "./smsService";

// Notification processor service
export class NotificationService {
  private MAX_RETRIES = 3;
  private retryInterval = 60000; // 1 minute in milliseconds

  constructor() {
    // Set up retries for failed notifications
    setInterval(() => this.processFailedNotifications(), this.retryInterval);
  }

  async sendNotification(notificationData: SendNotification): Promise<Notification> {
    // Create notification in pending state
    const notification = await storage.createNotification({
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      status: NotificationStatus.PENDING,
      priority: notificationData.priority || false,
      retryCount: 0,
    });

    // Process notification immediately (asynchronously)
    this.processNotification(notification).catch(err => {
      console.error(`Error processing notification ${notification.id}:`, err);
    });

    return notification;
  }

  private async processNotification(notification: Notification): Promise<boolean> {
    try {
      const success = await this.deliverNotification(notification);
      
      if (success) {
        await storage.updateNotificationStatus(notification.id, NotificationStatus.DELIVERED);
        return true;
      } else {
        await storage.updateNotificationStatus(notification.id, NotificationStatus.FAILED);
        return false;
      }
    } catch (error) {
      console.error(`Error delivering notification ${notification.id}:`, error);
      await storage.updateNotificationStatus(notification.id, NotificationStatus.FAILED);
      return false;
    }
  }

  private async deliverNotification(notification: Notification): Promise<boolean> {
    switch (notification.type) {
      case NotificationType.EMAIL:
        return await emailService.send({
          to: notification.userId,
          subject: notification.title,
          body: notification.message
        });
        
      case NotificationType.SMS:
        return await smsService.send({
          to: notification.userId,
          body: notification.message
        });
        
      case NotificationType.IN_APP:
        // For in-app notifications, we just mark as delivered immediately
        // In a real system, this might push to a websocket or similar
        return true;
        
      default:
        throw new Error(`Unsupported notification type: ${notification.type}`);
    }
  }

  async processFailedNotifications(): Promise<void> {
    const failedNotifications = await storage.getFailedNotifications();
    
    for (const notification of failedNotifications) {
      // Skip if max retries reached
      if (notification.retryCount >= this.MAX_RETRIES) {
        continue;
      }
      
      // Increment retry count
      const updated = await storage.incrementRetryCount(notification.id);
      if (!updated) continue;
      
      // Update status to pending
      await storage.updateNotificationStatus(updated.id, NotificationStatus.PENDING);
      
      // Process notification
      this.processNotification(updated).catch(err => {
        console.error(`Error processing retry for notification ${notification.id}:`, err);
      });
    }
  }
}

export default new NotificationService();
