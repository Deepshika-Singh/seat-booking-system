import {
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";

import {
  ErrorBoundary,
  Navbar,
  ProtectedRoute,
} from "./components";

import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

/* =========================
   USER PAGES
========================= */

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import ShowDetails from "./pages/ShowDetails";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* =========================
   ADMIN PAGES
========================= */

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminShows from "./pages/admin/AdminShows";
import AdminBookings from "./pages/admin/AdminBookings";

/* =========================
   ADMIN ROUTE
========================= */

import AdminRoute from "./routes/AdminRoute";

function App() {

  return (
    <ErrorBoundary>

      <AuthProvider>

        <BookingProvider>

          <div className="min-h-screen bg-gray-50">

            {/* NAVBAR */}

            <Navbar />

            {/* ROUTES */}

            <main>

              <Routes>

                {/* =========================
                    USER ROUTES
                ========================= */}

                <Route
                  path="/"
                  element={<Home />}
                />

                <Route
                  path="/events/:id"
                  element={<EventDetails />}
                />

                <Route
                  path="/shows/:id"
                  element={<ShowDetails />}
                />

                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />

                {/* =========================
                    AUTH ROUTES
                ========================= */}

                <Route
                  path="/login"
                  element={<Login />}
                />

                <Route
                  path="/signup"
                  element={<Signup />}
                />

                {/* =========================
                    ADMIN ROUTES
                ========================= */}

                <Route
                  path="/admin"
                  element={<Navigate to="/admin/events" replace />}
                />

                <Route
                  path="/admin/events"
                  element={
                    <AdminRoute>
                      <AdminEvents />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/shows"
                  element={
                    <AdminRoute>
                      <AdminShows />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/bookings"
                  element={
                    <AdminRoute>
                      <AdminBookings />
                    </AdminRoute>
                  }
                />

                {/* =========================
                    404 PAGE
                ========================= */}

                <Route
                  path="*"
                  element={
                    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-100 px-4">

                      <h1 className="mb-4 text-7xl font-extrabold text-red-600">
                        404
                      </h1>

                      <p className="mb-6 text-center text-xl text-gray-600">
                        Page not found
                      </p>

                      <Link
                        to="/"
                        className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                      >
                        Go Home
                      </Link>

                    </div>
                  }
                />

              </Routes>

            </main>

          </div>

        </BookingProvider>

      </AuthProvider>

    </ErrorBoundary>
  );
}

export default App;