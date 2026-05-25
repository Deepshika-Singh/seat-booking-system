import { useEffect, useState } from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import api from '../services/api';

import {
  asArray,
  unwrapApiData,
} from '../utils/apiResponse';

import { useAuth } from '../hooks/useAuth';

import { useFetch } from '../hooks/useFetch';

import {
  Alert,
  Button,
  Card,
  LoadingSkeleton,
  SeatGrid,
  FakePaymentModal,
} from '../components';

const ShowDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { isAuthenticated } =
    useAuth();

  const {
    data: show,
    loading,
    error,
  } = useFetch(`/shows/${id}`);

  const [seats, setSeats] =
    useState([]);

  const [seatSummary, setSeatSummary] =
    useState({
      totalSeats: 0,
      occupiedSeats: 0,
      availableSeats: 0,
    });

  const [selectedSeats, setSelectedSeats] =
    useState([]);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [bookingError, setBookingError] =
    useState('');

  const [bookingSuccess, setBookingSuccess] =
    useState('');

  const [showPayment, setShowPayment] =
    useState(false);

  const [paymentProcessing, setPaymentProcessing] =
    useState(false);
  const [paymentCancelled, setPaymentCancelled] =
  useState(false);

  const [createdBookingId, setCreatedBookingId] =
    useState(null);

  /* =========================
      FETCH SEATS
  ========================= */

  const fetchSeats = async () => {
    try {
      const response =
        await api.get(
          `/shows/${id}/seats`
        );

      const payload =
        unwrapApiData(
          response.data
        );

      setSeats(
        Array.isArray(payload?.seats)
          ? payload.seats
          : asArray(payload)
      );

      setSeatSummary(
        payload?.summary || {
          totalSeats: 0,
          occupiedSeats: 0,
          availableSeats: 0,
        }
      );
    } catch (err) {
      console.error(
        'Failed to fetch seats:',
        err
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetchSeats();
    }
  }, [id]);

  /* =========================
      CREATE BOOKING
  ========================= */

  const createBooking = async () => {

  const response =
    await api.post(
      "/booking/book-seat",
      {
        showId: id,
        seats: selectedSeats,
        totalPrice:
          show.price *
          selectedSeats.length,
      }
    );

  const payload =
    unwrapApiData(
      response.data
    );

  return payload;
};
  /* =========================
      HANDLE PAYMENT FLOW
  ========================= */

  const handleFakePayment = async () => {
  try {
    setPaymentProcessing(true);

    // 1. create booking job
    const bookingRes = await api.post(
      "/booking/book-seat",
      {
        showId: id,
        seats: selectedSeats,
      }
    );

    const jobId =
      bookingRes.data?.jobId;

    if (!jobId) {
      throw new Error(
        "Booking job not created"
      );
    }

    // 2. wait for worker
    await new Promise((r) =>
      setTimeout(r, 2000)
    );

    // 3. fetch latest booking
    const myBookings =
      await api.get(
        "/booking/my-bookings"
      );

    const latest =
      myBookings.data.data.at(-1);

    const bookingId =
      latest?._id;

    if (!bookingId) {
      throw new Error(
        "Booking not created yet"
      );
    }

    // IMPORTANT
    setCreatedBookingId(
      bookingId
    );

    // 4. create order
    await api.post(
      "/payment/create-order",
      {
        bookingId,
      }
    );

    // 5. fake payment delay
    await new Promise((r) =>
      setTimeout(r, 10000)
    );

    // 6. CHECK latest status before verify
    const latestBookings =
      await api.get(
        "/booking/my-bookings"
      );

    const currentBooking =
      latestBookings.data.data.find(
        (b) =>
          b._id === bookingId
      );

    // USER CANCELLED PAYMENT
    if (
      currentBooking?.status ===
      "cancelled"
    ) {
      setPaymentProcessing(false);
      return;
    }

    // 7. verify payment
    await api.post(
      "/payment/verify",
      {
        bookingId,
      }
    );

    // 8. success UI
    setBookingSuccess(
      "Payment successful!"
    );

    setSelectedSeats([]);

    setShowPayment(false);

    fetchSeats();

  } catch (err) {

    console.log(err);

    setBookingError(
      err.response?.data
        ?.message ||
        err.message ||
        "Payment failed"
    );

  } finally {
    setPaymentProcessing(false);
  }
};

  /* =========================
      OPEN PAYMENT MODAL
  ========================= */

  const handleProceedPayment =
    () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      if (!selectedSeats.length) {
        setBookingError(
          'Please select at least one seat'
        );
        return;
      }

      setBookingError('');

      setShowPayment(true);
    };

  /* =========================
      LOADING
  ========================= */

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  /* =========================
      ERROR
  ========================= */

  if (error || !show) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Alert
          type="error"
          message={
            error ||
            'Show not found'
          }
        />
      </div>
    );
  }


  const handleCancelPayment =
  async () => {
    try {

      if (
        !createdBookingId
      ) {
        setShowPayment(false);
        return;
      }

      await api.post(
        "/payment/cancel",
        {
          bookingId:
            createdBookingId,
        }
      );

      setBookingError(
        "Payment cancelled"
      );

      setSelectedSeats([]);

      fetchSeats();

    } catch (error) {

      console.log(error);

    } finally {

      setShowPayment(false);

      setPaymentProcessing(
        false
      );
    }
  };

  /* =========================
      UI
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="mx-auto max-w-7xl px-4">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-6 font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LEFT SIDE */}

          <div className="space-y-6 lg:col-span-2">

            {/* SHOW INFO */}

            <Card>

              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {show.event?.name ||
                  'Show'}
              </h1>

              <div className="grid grid-cols-2 gap-4 text-gray-700">

                <div>
                  <p className="text-sm text-gray-500">
                    Venue
                  </p>

                  <p className="font-semibold">
                    {show.venue}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <p className="font-semibold">
                    {new Date(
                      show.date
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Price Per Seat
                  </p>

                  <p className="font-semibold">
                    ₹{show.price}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Remaining Seats
                  </p>

                  <p className="font-semibold text-green-600">
                    {
                      seatSummary.availableSeats
                    }
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Booked Seats
                  </p>

                  <p className="font-semibold text-red-500">
                    {
                      seatSummary.occupiedSeats
                    }
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total Seats
                  </p>

                  <p className="font-semibold">
                    {
                      seatSummary.totalSeats
                    }
                  </p>
                </div>

              </div>
            </Card>

            {/* SEAT SECTION */}

            <Card>

              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Select Seats
              </h2>

              {bookingError && (
                <Alert
                  type="error"
                  message={
                    bookingError
                  }
                  onClose={() =>
                    setBookingError('')
                  }
                />
              )}

              {bookingSuccess && (
  <div className="mb-4 rounded-lg bg-green-100 p-4">
    <p className="font-semibold text-green-700">
      {bookingSuccess}
    </p>

    <button
      onClick={() =>
        navigate("/my-bookings")
      }
      className="mt-3 rounded bg-green-600 px-4 py-2 text-white"
    >
      View My Bookings
    </button>
  </div>
)}

              {/* LEGEND */}

              <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">

                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-gray-300" />
                  Available
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-red-500" />
                  Booked
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-blue-600" />
                  Selected
                </span>

              </div>

              {/* SCREEN */}

              <div className="mb-8">

                <div className="mx-auto mb-2 h-3 w-3/4 rounded-full bg-gradient-to-r from-gray-300 to-gray-400" />

                <p className="text-center text-sm text-gray-500">
                  SCREEN
                </p>

              </div>

              {/* SEAT GRID */}

              <SeatGrid
                seats={seats}
                selectedSeats={
                  selectedSeats
                }
                onSelect={
                  setSelectedSeats
                }
              />

            </Card>
          </div>

          {/* RIGHT SIDE */}

          <div>

            <Card className="sticky top-24">

              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Booking Summary
              </h3>

              <div className="mb-4 space-y-3 border-b pb-4 text-gray-700">

                <div className="flex justify-between">
                  <span>
                    Selected Seats
                  </span>

                  <span className="font-semibold">
                    {selectedSeats.length
                      ? selectedSeats.join(
                          ', '
                        )
                      : '—'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Number of Seats
                  </span>

                  <span className="font-semibold">
                    {
                      selectedSeats.length
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Price Per Seat
                  </span>

                  <span className="font-semibold">
                    ₹{show.price}
                  </span>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="font-semibold">
                    Total Amount
                  </span>

                  <span className="font-bold text-green-600">
                    ₹
                    {show.price *
                      selectedSeats.length}
                  </span>
                </div>

              </div>

              <Button
                onClick={
                  handleProceedPayment
                }
                disabled={
                  !selectedSeats.length
                }
                className="w-full"
              >
                Proceed To Payment
              </Button>

              {!isAuthenticated && (
                <p className="mt-4 text-center text-sm text-gray-600">

                  Please{' '}

                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline"
                  >
                    login
                  </Link>

                  {' '}to book

                </p>
              )}

            </Card>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}

      <FakePaymentModal
  open={showPayment}
  onClose={() =>
    setShowPayment(false)
  }
  onPay={handleFakePayment}
  onCancelPayment={
    handleCancelPayment
  }
  processing={paymentProcessing}
  selectedSeats={selectedSeats}
  totalAmount={
    show.price *
    selectedSeats.length
  }
/>
    </div>
  );
};

export default ShowDetails;