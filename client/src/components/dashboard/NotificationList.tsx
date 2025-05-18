import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserNotifications, retryNotification, NotificationItem } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface NotificationListProps {
  onRetrySuccess?: () => void;
}

// Default test user ID - in a real app, this would come from authentication
const TEST_USER_ID = "user123";

export default function NotificationList({ onRetrySuccess }: NotificationListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(5);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/users/${TEST_USER_ID}/notifications`, { limit, offset: currentPage * limit }],
    queryFn: () => getUserNotifications(TEST_USER_ID, { limit, offset: currentPage * limit }),
  });
  
  const retryMutation = useMutation({
    mutationFn: retryNotification,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification retry initiated",
        variant: "default",
      });
      
      // Invalidate cache to refresh data
      queryClient.invalidateQueries({
        queryKey: [`/api/users/${TEST_USER_ID}/notifications`]
      });
      
      if (onRetrySuccess) onRetrySuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to retry notification",
        variant: "destructive",
      });
    }
  });

  // Set up auto-refresh every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  const handleRetry = (id: number) => {
    retryMutation.mutate(id);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return "envelope";
      case "sms":
        return "sms";
      case "in-app":
        return "comment-dots";
      default:
        return "bell";
    }
  };
  
  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case "email":
        return "bg-blue-50 text-primary";
      case "sms":
        return "bg-green-50 text-green-600";
      case "in-app":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-yellow-50 text-yellow-600";
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-success";
      case "failed":
        return "bg-error";
      case "pending":
        return "bg-warning";
      default:
        return "bg-neutral-400";
    }
  };
  
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "unknown time";
    }
  };
  
  const renderNotification = (notification: NotificationItem) => {
    return (
      <div 
        key={notification.id} 
        className="border-b border-neutral-200 hover:bg-neutral-50"
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <span className={`inline-block p-2 rounded-md ${getNotificationIconColor(notification.type)}`}>
                <i className={`fas fa-${getNotificationIcon(notification.type)}`}></i>
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-neutral-500">{notification.title}</h4>
                <div className="flex items-center">
                  <Badge className={`${getStatusBadgeColor(notification.status)} text-white`}>
                    {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                  </Badge>
                  <span className="text-neutral-400 text-sm ml-3">
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-neutral-400 mt-1">{notification.message}</p>
              <div className="mt-2 text-sm text-neutral-400">
                <span className="mr-3">
                  <i className="fas fa-user mr-1"></i> {notification.userId}
                </span>
                <span>
                  <i className="fas fa-tag mr-1"></i> {notification.type}
                </span>
              </div>
              
              {notification.status === "failed" && (
                <div className="mt-2">
                  <Button 
                    variant="link" 
                    className="text-sm text-primary hover:text-secondary p-0 h-auto"
                    onClick={() => handleRetry(notification.id)}
                    disabled={retryMutation.isPending}
                  >
                    <i className="fas fa-redo mr-1"></i> Retry
                    {retryMutation.isPending && <i className="fas fa-spinner fa-spin ml-1"></i>}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderSkeletonNotification = (index: number) => (
    <div key={index} className="border-b border-neutral-200 p-4">
      <div className="flex items-start">
        <Skeleton className="h-10 w-10 rounded-md mr-4" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center">
              <Skeleton className="h-6 w-20 ml-2" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-1" />
          <div className="mt-2">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="shadow border-0">
      <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-500">Recent Notifications</h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-neutral-400 hover:text-primary"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <i className={`fas fa-sync-alt ${isLoading ? "fa-spin" : ""}`}></i>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        // Skeleton loading state
        Array(5).fill(0).map((_, index) => renderSkeletonNotification(index))
      ) : error ? (
        // Error state
        <div className="p-8 text-center">
          <p className="text-error mb-4">Failed to load notifications</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      ) : data?.notifications.length === 0 ? (
        // Empty state
        <div className="p-8 text-center text-neutral-400">
          <i className="fas fa-bell-slash text-3xl mb-2"></i>
          <p>No notifications found</p>
        </div>
      ) : (
        // Notifications list
        data?.notifications.map(notification => renderNotification(notification))
      )}
      
      {/* Pagination */}
      <div className="px-6 py-4 flex justify-between items-center border-t border-neutral-200">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 0 || isLoading}
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          className="text-neutral-400 hover:text-primary"
        >
          <i className="fas fa-chevron-left mr-1"></i> Previous
        </Button>
        
        <div className="text-neutral-400 text-sm">
          {!isLoading && data && (
            `Showing ${Math.min(limit, data.notifications.length)} of ${data.total} notifications`
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          disabled={!data || data.total <= (currentPage + 1) * limit || isLoading}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="text-primary hover:text-secondary"
        >
          Next <i className="fas fa-chevron-right ml-1"></i>
        </Button>
      </div>
    </Card>
  );
}
