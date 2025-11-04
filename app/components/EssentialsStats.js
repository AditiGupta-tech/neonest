import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Package, AlertTriangle, CheckCircle, TrendingUp, ShoppingCart } from "lucide-react";

const EssentialsStats = ({ stats, lowStockItems, outOfStockItems }) => {
  const statsCards = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: "Items in inventory",
    },
    {
      title: "In Stock",
      value: stats.inStockCount,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      description: "Well stocked items",
    },
    {
      title: "Low Stock",
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      description: "Need restocking soon",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockCount,
      icon: TrendingUp,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      description: "Urgent restocking needed",
    },
  ];

  const getHealthScore = () => {
    if (stats.totalItems === 0) return { score: 100, status: "No items", color: "text-gray-500" };
    
    const healthScore = Math.round(
      ((stats.inStockCount / stats.totalItems) * 100)
    );
    
    if (healthScore >= 80) return { score: healthScore, status: "Excellent", color: "text-green-600" };
    if (healthScore >= 60) return { score: healthScore, status: "Good", color: "text-blue-600" };
    if (healthScore >= 40) return { score: healthScore, status: "Fair", color: "text-yellow-600" };
    return { score: healthScore, status: "Poor", color: "text-red-600" };
  };

  const health = getHealthScore();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/80 dark:bg-gray-700 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health Score and Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Inventory Health */}
        <Card className="bg-white/80 dark:bg-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Inventory Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Overall Score
                </span>
                <span className={`text-lg font-bold ${health.color}`}>
                  {health.score}% {health.status}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    health.score >= 80 ? 'bg-green-500' :
                    health.score >= 60 ? 'bg-blue-500' :
                    health.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${health.score}%` }}
                />
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stats.outOfStockCount > 0 && (
                  <p className="text-red-600 dark:text-red-400">
                    ⚠️ {stats.outOfStockCount} items need immediate attention
                  </p>
                )}
                {stats.lowStockCount > 0 && stats.outOfStockCount === 0 && (
                  <p className="text-yellow-600 dark:text-yellow-400">
                    📋 {stats.lowStockCount} items running low
                  </p>
                )}
                {stats.lowStockCount === 0 && stats.outOfStockCount === 0 && stats.totalItems > 0 && (
                  <p className="text-green-600 dark:text-green-400">
                    ✅ All items are well stocked!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Shopping List */}
        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <Card className="bg-white/80 dark:bg-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
                Quick Shopping List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {outOfStockItems.slice(0, 3).map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      {item.name}
                    </span>
                    <span className="text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                      OUT
                    </span>
                  </div>
                ))}
                
                {lowStockItems.slice(0, 2).map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {item.name}
                    </span>
                    <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      {item.currentStock} left
                    </span>
                  </div>
                ))}
                
                {(lowStockItems.length + outOfStockItems.length) > 5 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                    +{(lowStockItems.length + outOfStockItems.length) - 5} more items need attention
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EssentialsStats;