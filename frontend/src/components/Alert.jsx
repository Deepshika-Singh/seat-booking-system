export const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type];

  return (
    <div
      className={`mb-4 flex items-center justify-between rounded-lg border p-4 ${styles}`}
    >
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="font-bold">
          ×
        </button>
      )}
    </div>
  );
};
