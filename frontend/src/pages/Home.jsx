import { useState } from "react";
import { Link } from "react-router-dom";

import { useFetch } from "../hooks/useFetch";

import {
  Alert,
  Card,
  LoadingSkeleton,
} from "../components";

import { asArray } from "../utils/apiResponse";

const HomePage = () => {
  const [activeCategory, setActiveCategory] =
    useState("all");

  const {
    data,
    loading,
    error,
  } = useFetch("/events");

  const events = asArray(data);

  const filteredEvents =
    activeCategory === "all"
      ? events
      : events.filter(
          (event) =>
            event.eventType?.toLowerCase() ===
            activeCategory
        );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* HERO SECTION */}

      <div className="bg-gradient-to-r from-red-600 to-purple-700 py-16 text-black">
        <div className="mx-auto max-w-7xl px-4">
          
          <h1 className="mb-4 text-5xl font-bold">
            Book Your Favorite Shows
          </h1>

          <p className="max-w-2xl text-lg text-red-100">
            Movies, concerts, and theater
            experiences — all in one place.
          </p>
        </div>
      </div>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-10">

        {/* CATEGORY FILTERS */}

        <div className="mb-8 flex flex-wrap gap-3">
          
          {[
            "all",
            "movie",
            "concert",
            "theater",
          ].map((category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(category)
              }
              className={`rounded-full px-6 py-2 font-semibold transition ${
                activeCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
              }`}
            >
              {category.charAt(0).toUpperCase() +
                category.slice(1)}
            </button>
          ))}
        </div>

        {/* ERROR */}

        {error && (
          <Alert
            type="error"
            message={error}
          />
        )}

        {/* EMPTY */}

        {!filteredEvents.length ? (
          <Card className="py-12 text-center text-gray-600">
            No events available
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {filteredEvents.map((event) => (
              <Card
                key={event._id}
                className="overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl"
              >
                
                {/* IMAGE */}

                <div className="flex h-52 items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300">
                  <span className="text-6xl">
                    {event.eventType ===
                    "movie"
                      ? "🎬"
                      : event.eventType ===
                          "concert"
                        ? "🎵"
                        : "🎭"}
                  </span>
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600">
                    {event.eventType}
                  </p>

                  <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    {event.name}
                  </h2>

                  <p className="mb-5 line-clamp-3 text-gray-600">
                    {event.description}
                  </p>

                  <Link
                    to={`/events/${event._id}`}
                    className="inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
                  >
                    View Shows
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;