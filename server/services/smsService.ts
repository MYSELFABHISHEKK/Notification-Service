// Mock SMS Service

export interface SmsMessage {
  to: string;
  body: string;
}

export class SmsService {
  async send(message: SmsMessage): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simulate occasional failure (15% chance)
    const isSuccessful = Math.random() < 0.85;
    
    if (isSuccessful) {
      console.log(`[SMS] Sent to: ${message.to}, Message: ${message.body.substring(0, 20)}...`);
      return true;
    } else {
      console.error(`[SMS] Failed to send to: ${message.to}, Message: ${message.body.substring(0, 20)}...`);
      return false;
    }
  }
}

export default new SmsService();
