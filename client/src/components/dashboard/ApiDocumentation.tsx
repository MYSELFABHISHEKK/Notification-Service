import { Card } from "@/components/ui/card";

export default function ApiDocumentation() {
  return (
    <Card className="shadow border-0">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-500">API Documentation</h3>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-2 text-neutral-500">POST /api/notifications</h4>
          <p className="text-neutral-400 mb-3">Send a notification to a specific user.</p>
          
          <div className="mb-3">
            <h5 className="text-sm font-semibold mb-1 text-neutral-500">Request Body</h5>
            <div className="code-block text-sm">
{`{
  "userId": "user123",
  "type": "email",  // "email", "sms", or "in-app"
  "title": "Account Verification",
  "message": "Please verify your account",
  "priority": false
}`}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-semibold mb-1 text-neutral-500">Response (201 Created)</h5>
            <div className="code-block text-sm">
{`{
  "id": 12345,
  "userId": "user123",
  "type": "email",
  "title": "Account Verification",
  "status": "pending",
  "createdAt": "2023-07-15T09:24:17Z"
}`}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-semibold mb-2 text-neutral-500">GET /api/users/{'{id}'}/notifications</h4>
          <p className="text-neutral-400 mb-3">Retrieve notifications for a specific user.</p>
          
          <div className="mb-3">
            <h5 className="text-sm font-semibold mb-1 text-neutral-500">Path Parameters</h5>
            <div className="code-block text-sm">
              id: string (required) - The ID of the user
            </div>
          </div>
          
          <div className="mb-3">
            <h5 className="text-sm font-semibold mb-1 text-neutral-500">Query Parameters</h5>
            <div className="code-block text-sm">
{`limit: number - Maximum number of notifications to return (default: 10)
offset: number - Number of notifications to skip (default: 0)
status: string - Filter by status ("delivered", "failed", "pending")
type: string - Filter by type ("email", "sms", "in-app")`}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-semibold mb-1 text-neutral-500">Response (200 OK)</h5>
            <div className="code-block text-sm">
{`{
  "notifications": [
    {
      "id": 12345,
      "userId": "user123",
      "title": "Account Verification",
      "message": "Please verify your account",
      "type": "email",
      "status": "delivered",
      "priority": false,
      "retryCount": 0,
      "createdAt": "2023-07-15T09:24:17Z",
      "updatedAt": "2023-07-15T09:24:20Z",
      "deliveredAt": "2023-07-15T09:24:20Z"
    },
    {
      "id": 12346,
      "userId": "user123",
      "title": "New Message",
      "message": "You received a new message",
      "type": "in-app",
      "status": "delivered",
      "priority": true,
      "retryCount": 0,
      "createdAt": "2023-07-14T14:12:09Z",
      "updatedAt": "2023-07-14T14:12:10Z",
      "deliveredAt": "2023-07-14T14:12:10Z"
    }
  ],
  "total": 24,
  "limit": 10,
  "offset": 0
}`}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
