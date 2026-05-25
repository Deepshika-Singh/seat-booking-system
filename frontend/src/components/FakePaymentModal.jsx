const FakePaymentModal = ({
  open,
  onClose,
  onPay,
  processing,
  selectedSeats,
  totalAmount,
  onCancelPayment,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Payment Simulation
        </h2>

        <div className="space-y-4">

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">
              Selected Seats
            </span>

            <span className="font-semibold text-gray-900">
              {selectedSeats.join(", ")}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">
              Number of Seats
            </span>

            <span className="font-semibold">
              {selectedSeats.length}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">
              Total Amount
            </span>

            <span className="text-2xl font-bold text-green-600">
              ₹{totalAmount}
            </span>
          </div>

        </div>

        <div className="mt-8 flex gap-3">

          <button
  onClick={onCancelPayment}
            
            className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onPay}
            disabled={processing}
            className="flex-1 rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            {processing
              ? "Processing..."
              : "Pay Now"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default FakePaymentModal;