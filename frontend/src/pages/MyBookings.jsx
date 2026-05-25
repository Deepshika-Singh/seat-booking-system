import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useBooking } from "../hooks/useBooking";

import {
  Alert,
  Card,
  LoadingSkeleton,
} from "../components";

const statusColor = {
  booked: "text-green-600",
  pending: "text-yellow-600",
  cancelled: "text-red-600",
};

const MyBookings = () => {

  const navigate = useNavigate();

  const {
    bookings,
    loading,
    error,
    fetchBookings,
  } = useBooking();

  const [filter, setFilter] =
    useState("all");

  const [sortOrder, setSortOrder] =
    useState("latest");

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* =========================
      STATS
  ========================= */

  const totalBookings =
    bookings.length;

  const successfulBookings =
    bookings.filter(
      (b) => b.status === "booked"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (b) => b.status === "cancelled"
    ).length;

  /* =========================
      FILTER + SORT
  ========================= */

  const filteredBookings =
    useMemo(() => {

      let filtered = [...bookings];

      // FILTER
      if (filter !== "all") {
        filtered = filtered.filter(
          (booking) =>
            booking.status === filter
        );
      }

      // SORT
      filtered.sort((a, b) => {

        if (sortOrder === "latest") {
          return (
            new Date(b.createdAt) -
            new Date(a.createdAt)
          );
        }

        return (
          new Date(a.createdAt) -
          new Date(b.createdAt)
        );
      });

      return filtered;

    }, [bookings, filter, sortOrder]);

  /* =========================
      LOADING
  ========================= */

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="mx-auto max-w-5xl px-4">

        {/* HEADER */}

        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          My Bookings
        </h1>

        <p className="mb-8 text-gray-600">
          View and manage your bookings
        </p>

        {/* ERROR */}

        {error && (
          <Alert
            type="error"
            message={error}
          />
        )}

        {/* STATS */}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

          <Card>
            <p className="text-sm text-gray-500">
              Total Bookings
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {totalBookings}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Successful
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {successfulBookings}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Cancelled
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {cancelledBookings}
            </h2>
          </Card>

        </div>

        {/* FILTERS */}

        <div className="mb-6 flex flex-wrap items-center gap-4">

          {/* STATUS FILTER */}

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="all">
              All
            </option>

            <option value="booked">
              Booked
            </option>

            <option value="cancelled">
              Cancelled
            </option>

            <option value="pending">
              Pending
            </option>
          </select>

          {/* SORT */}

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                e.target.value
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="latest">
              Latest First
            </option>

            <option value="oldest">
              Oldest First
            </option>
          </select>

        </div>

        {/* EMPTY */}

        {!filteredBookings.length ? (
          <Card className="py-12 text-center">

            <p className="mb-4 text-lg text-gray-600">
              No bookings found
            </p>

            <Link
              to="/"
              className="font-semibold text-blue-600 hover:underline"
            >
              Browse Events
            </Link>

          </Card>
        ) : (

          <div className="space-y-4">

            {filteredBookings.map(
              (booking) => (

                <Card
                  key={booking._id}
                  className="cursor-pointer transition hover:shadow-lg"
                  onClick={() =>
                    navigate(
                      `/shows/${booking.show?._id}`
                    )
                  }
                >

                  {/* TITLE */}

                  <div className="mb-4 flex items-start justify-between">

                    <div>

                      <h3 className="text-2xl font-bold text-gray-900">

                        {booking.show?.event
                          ?.name ||
                          booking.show
                            ?.venue ||
                          "Show"}

                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Booking ID:
                        {" "}
                        {booking._id}
                      </p>

                    </div>

                    <p
                      className={`text-lg font-bold capitalize ${
                        statusColor[
                          booking.status
                        ] ||
                        "text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </p>

                  </div>

                  {/* DETAILS */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

  {/* LEFT */}

  <div>

    <p className="mb-2 text-gray-600">
      📍 Venue:
      {" "}
      <span className="font-semibold">
        {booking.show?.venue || "N/A"}
      </span>
    </p>

    <p className="mb-2 text-gray-600">
      📅 Date:
      {" "}
      <span className="font-semibold">
        {booking.show?.date
          ? new Date(
              booking.show.date
            ).toLocaleDateString()
          : "—"}
      </span>
    </p>

    <p className="mb-2 text-gray-600">
      ⏰ Time:
      {" "}
      <span className="font-semibold">
        {booking.show?.date
          ? new Date(
              booking.show.date
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—"}
      </span>
    </p>

    <p className="text-gray-600">
      🎟️ Seats:
      {" "}
      <strong>
        {booking.seats?.join(", ")}
      </strong>
    </p>

  </div>

  {/* RIGHT */}

  <div className="flex flex-col justify-center">

    <p className="text-sm text-gray-500">
      Total Amount
    </p>

    <h3 className="text-3xl font-bold text-gray-900">
      ₹{booking.totalPrice}
    </h3>

    <button
      onClick={(e) => {
        e.stopPropagation();

        navigate(
          `/shows/${booking.show?._id}`
        );
      }}
      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      View Show
    </button>

  </div>

</div>

                </Card>
              )
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;