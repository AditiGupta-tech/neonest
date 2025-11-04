import React from "react";

const LoadingSkeleton = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const EssentialsCardSkeleton = () => {
  return (
    <div className="bg-white/80 dark:bg-gray-700 backdrop-blur-sm rounded-lg border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <LoadingSkeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-2">
            <LoadingSkeleton className="h-5 w-32" />
            <LoadingSkeleton className="h-3 w-24" />
          </div>
        </div>
        <LoadingSkeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <LoadingSkeleton className="h-8 w-16" />
            <LoadingSkeleton className="h-4 w-12" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-28" />
          <LoadingSkeleton className="h-4 w-16" />
        </div>

        <LoadingSkeleton className="h-4 w-full" />

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <LoadingSkeleton className="h-8 flex-1" />
          <LoadingSkeleton className="h-8 w-12" />
        </div>
      </div>
    </div>
  );
};

const EssentialsListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <EssentialsCardSkeleton key={index} />
      ))}
    </div>
  );
};

const AlertSkeleton = () => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-200 border-yellow-200 rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-2">
        <LoadingSkeleton className="w-5 h-5 rounded-full" />
        <LoadingSkeleton className="h-5 w-48" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-6 w-24 rounded-full" />
        ))}
      </div>
    </div>
  );
};

const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <LoadingSkeleton className="h-8 w-64 mb-2" />
        <LoadingSkeleton className="h-4 w-80" />
      </div>
      <LoadingSkeleton className="h-10 w-32" />
    </div>
  );
};

export {
  LoadingSkeleton,
  EssentialsCardSkeleton,
  EssentialsListSkeleton,
  AlertSkeleton,
  HeaderSkeleton,
};