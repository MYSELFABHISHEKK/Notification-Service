import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import NotificationForm from "@/components/dashboard/NotificationForm";
import NotificationList from "@/components/dashboard/NotificationList";
import ApiDocumentation from "@/components/dashboard/ApiDocumentation";
import { getNotificationStats } from "@/lib/api";

export default function Dashboard() {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/notifications/stats'],
    queryFn: getNotificationStats,
  });

  useEffect(() => {
    // Set up auto-refresh every 30 seconds.
    const intervalId = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  return (
    <div className="flex h-screen bg-neutral-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-100">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Total Notifications"
              value={isLoading ? "-" : stats?.total.toString() || "0"}
              icon="bell"
              color="blue"
              percentChange={12.5}
              loading={isLoading}
              error={!!error}
            />
            <StatCard 
              title="Delivery Rate"
              value={isLoading ? "-" : `${stats?.deliveryRate || 0}%`}
              icon="paper-plane"
              color="green"
              percentChange={1.8}
              loading={isLoading}
              error={!!error}
            />
            <StatCard 
              title="Failed Notifications"
              value={isLoading ? "-" : stats?.failed.toString() || "0"}
              icon="exclamation-triangle"
              color="red"
              percentChange={-4.7}
              isNegative
              loading={isLoading}
              error={!!error}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <NotificationForm onSuccess={() => refetch()} />
            </div>
            
            <div className="lg:col-span-2">
              <NotificationList onRetrySuccess={() => refetch()} />
            </div>
          </div>
          
          <div className="mt-6">
            <ApiDocumentation />
          </div>
        </main>
      </div>
    </div>
  );
}
