import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "red" | "yellow" | "purple";
  percentChange?: number;
  isNegative?: boolean;
  loading?: boolean;
  error?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  percentChange,
  isNegative = false,
  loading = false,
  error = false
}: StatCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-primary";
      case "green":
        return "bg-green-50 text-success";
      case "red":
        return "bg-red-50 text-error";
      case "yellow":
        return "bg-yellow-50 text-warning";
      case "purple":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-blue-50 text-primary";
    }
  };
  
  const getChangeColor = () => {
    return isNegative ? "text-error" : "text-success";
  };
  
  const getChangeIcon = () => {
    return isNegative ? "fa-arrow-down" : "fa-arrow-up";
  };

  return (
    <Card className="p-6 border-0 shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-neutral-400 text-sm">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : error ? (
            <p className="text-2xl font-semibold mt-1 text-error">Error</p>
          ) : (
            <h3 className="text-2xl font-semibold mt-1 text-neutral-500">{value}</h3>
          )}
        </div>
        <div className={`p-2 rounded-md ${getColorClasses()}`}>
          <i className={`fas fa-${icon}`}></i>
        </div>
      </div>
      
      {percentChange && !loading && !error && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            <i className={`fas ${getChangeIcon()} mr-1`}></i>
            {Math.abs(percentChange)}%
          </span>
          <span className="text-neutral-400 text-sm ml-2">vs last week</span>
        </div>
      )}
      
      {loading && (
        <div className="mt-4">
          <Skeleton className="h-4 w-32" />
        </div>
      )}
    </Card>
  );
}
