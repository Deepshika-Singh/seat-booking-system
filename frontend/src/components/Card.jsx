export const Card = ({ children, className = '' }) => (
  <div
    className={`rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg ${className}`}
  >
    {children}
  </div>
);
