import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { asArray } from "../utils/apiResponse";
import {
  Alert,
  Card,
  LoadingSkeleton,
} from "../components";

const EventDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data: event,
    loading: eventLoading,
    error: eventError,
  } = useFetch(`/events/${id}`);

  const {
    data: showsData,
    loading: showsLoading,
    error: showsError,
  } = useFetch(
    id ? `/shows/event/${id}` : null
  );

  const shows = asArray(showsData);

  if (eventLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Alert
          type="error"
          message={
            eventError || "Event not found"
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}

      <div className="relative h-[320px] overflow-hidden rounded-b-3xl bg-gradient-to-r from-red-700 via-red-600 to-pink-600">

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">

          <div className="max-w-2xl text-white">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-6 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30"
            >
              ← Back
            </button>

            

            <h1 className="mb-4 text-5xl font-bold">
              {event.name}
            </h1>

            <p className="text-lg text-red-100">
              {event.description}
            </p>

          </div>
        </div>
      </div>

      {/* SHOWS */}

      <div className="mx-auto max-w-7xl px-4 py-10">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Available Shows
            </h2>

            <p className="mt-1 text-gray-600">
              Choose your preferred venue
              and timing
            </p>
          </div>

        </div>

        {showsError && (
          <Alert
            type="error"
            message={showsError}
          />
        )}

        {showsLoading ? (
          <LoadingSkeleton count={3} />
        ) : !shows?.length ? (
          <Card className="py-14 text-center text-gray-600">
            No shows scheduled for this
            event.
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

            {shows.map((show) => (

              <div
                key={show._id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                {/* IMAGE */}

                <div className="relative h-52 overflow-hidden">

                  <img
                    src={
                      event.eventType ===
                      "movie"
                        ? "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop"
                        : event.eventType ===
                          "concert"
                        ? "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop"
                        : "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={event.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-4 left-4 text-white">

                    <p className="text-sm font-medium text-red-200">
                      {event.eventType.toUpperCase()}
                    </p>

                    <h3 className="text-2xl font-bold">
                      {show.venue}
                    </h3>

                  </div>
                </div>

                {/* CONTENT */}

                <div className="p-6">

                  <div className="mb-5 space-y-3">

                    <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">

                      <span className="text-gray-500">
                        Date
                      </span>

                      <span className="font-semibold text-gray-900">
                        {new Date(
                          show.date
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">

                      <span className="text-gray-500">
                        Total Seats
                      </span>

                      <span className="font-semibold text-gray-900">
                        {show.totalSeats}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">

                      <span className="text-gray-500">
                        Price
                      </span>

                      <span className="text-xl font-bold text-red-600">
                        ₹{show.price}
                      </span>
                    </div>

                  </div>

                  <Link
                    to={`/shows/${show._id}`}
                    className="block w-full rounded-2xl bg-red-600 px-5 py-3 text-center text-lg font-semibold text-white transition hover:bg-red-700"
                  >
                    Select Seats
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;