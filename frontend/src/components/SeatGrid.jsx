const SeatGrid = ({
  seats,
  selectedSeats,
  onSelect,
}) => {
  const handleSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      onSelect(
        selectedSeats.filter(
          (seat) => seat !== seatNumber
        )
      );
    } else {
      onSelect([
        ...selectedSeats,
        seatNumber,
      ]);
    }
  };

  return (
    <div className="grid grid-cols-8 gap-2 rounded-xl bg-gray-100 p-6 sm:grid-cols-10">

      {seats.map((seat) => {
        const isBooked =
          seat.status !== "available";

        const isSelected =
          selectedSeats.includes(
            seat.seatNumber
          );

        return (
          <button
            key={seat.seatNumber}
            type="button"
            title={seat.seatNumber}
            disabled={isBooked}
            onClick={() =>
              !isBooked &&
              handleSelect(
                seat.seatNumber
              )
            }
            className={`h-10 w-10 rounded-lg text-xs font-bold transition-all duration-200 ${
              isBooked
                ? "cursor-not-allowed bg-red-500 text-white"
                : isSelected
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {seat.seatNumber}
          </button>
        );
      })}
    </div>
  );
};

export default SeatGrid;