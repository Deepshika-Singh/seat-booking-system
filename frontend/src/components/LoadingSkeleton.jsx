export const LoadingSkeleton = ({ count = 3, className = '' }) => (
  <div
    className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse rounded-xl bg-gray-200 p-5">
        <div className="mb-4 h-6 w-3/4 rounded bg-gray-300" />
        <div className="mb-3 h-4 w-1/2 rounded bg-gray-300" />
        <div className="mb-4 h-4 w-full rounded bg-gray-300" />
        <div className="h-10 w-1/3 rounded bg-gray-300" />
      </div>
    ))}
  </div>
);
