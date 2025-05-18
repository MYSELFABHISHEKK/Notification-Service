// Mock Email Service

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

export class EmailService {
  async send(message: EmailMessage): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate occasional failure (10% chance)
    const isSuccessful = Math.random() < 0.9;
    
    if (isSuccessful) {
      console.log(`[EMAIL] Sent to: ${message.to}, Subject: ${message.subject}`);
      return true;
    } else {
      console.error(`[EMAIL] Failed to send to: ${message.to}, Subject: ${message.subject}`);
      return false;
    }
  }
}

export default new EmailService();
