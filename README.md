# Notification Service

A powerful notification service API for managing and sending email, SMS, and in-app notifications to users.

## Overview

This application provides a comprehensive notification service with the following features:

- Send notifications via multiple channels (email, SMS, in-app)
- Retrieve user notifications with filtering and pagination
- Automatic retries for failed notifications
- Dashboard with notification statistics
- Mock delivery services with simulated delays/failures

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/notification-service.git
cd notification-service
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:5000

## Project Structure

```
notification-service/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/                  # Backend Express application
│   ├── services/            # Service implementations
│   │   ├── emailService.ts  # Email delivery service
│   │   ├── smsService.ts    # SMS delivery service
│   │   └── notificationService.ts  # Main notification handler
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Data storage implementation
│   └── vite.ts              # Vite integration for serving frontend
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Data models and validation
└── package.json             # Project configuration and dependencies
```

## API Endpoints

### Send a Notification

```
POST /api/notifications
```

Request body:
```json
{
  "userId": "user123",
  "type": "email",  // "email", "sms", or "in-app"
  "title": "Account Verification",
  "message": "Please verify your account",
  "priority": false
}
```

### Get User Notifications

```
GET /api/users/{userId}/notifications
```

Query parameters:
- `limit`: Maximum number of notifications to return (default: 10)
- `offset`: Number of notifications to skip (default: 0)
- `status`: Filter by status ("delivered", "failed", "pending")
- `type`: Filter by type ("email", "sms", "in-app")

### Get Notification Statistics

```
GET /api/notifications/stats
```

### Retry Failed Notification

```
POST /api/notifications/{id}/retry
```

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Data Storage**: In-memory storage (can be extended to use a database)
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with shadcn/ui components

## Dependencies

### Core Dependencies:
- react
- react-dom
- express
- typescript
- vite

### Frontend Dependencies:
- @tanstack/react-query
- react-hook-form
- zod
- @hookform/resolvers/zod
- wouter
- date-fns
- shadcn/ui components
- tailwindcss
- lucide-react
- class-variance-authority
- clsx

### Backend Dependencies:
- express
- drizzle-orm
- drizzle-zod
- typescript
- zod-validation-error

## Features

1. **Multi-channel Notifications**: Send notifications through email, SMS, or in-app channels.
2. **Retry Mechanism**: Automatically retry failed notifications with configurable retry limits.
3. **Delivery Tracking**: Track the delivery status of each notification.
4. **Priority Support**: Set priority for critical notifications.
5. **Dashboard**: Monitor notification statistics and performance.
6. **Real-time Updates**: Auto-refresh to keep the dashboard up to date.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
