import { useEffect, useState } from "react";

import api from "../../services/api";

import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminShows = () => {

  const [shows, setShows] = useState([]);

  const [events, setEvents] = useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      eventId: "",
      venue: "",
      date: "",
      totalSeats: "",
      price: "",
    });

  /* =========================
      FETCH EVENTS
  ========================= */

  const fetchEvents = async () => {
    try {

      const response =
        await api.get("/events");

      setEvents(
        response.data.data ||
          response.data
      );

    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
      FETCH SHOWS
  ========================= */

  const fetchShows = async () => {
    try {

      const response =
        await api.get("/events");

      const allEvents =
        response.data.data ||
        response.data;

      let allShows = [];

      for (const event of allEvents) {

        const showRes =
          await api.get(
            `/shows/event/${event._id}`
          );

        const eventShows =
          showRes.data.data || [];

        const updatedShows =
          eventShows.map((show) => ({
            ...show,
            eventName: event.name,
          }));

        allShows = [
          ...allShows,
          ...updatedShows,
        ];
      }

      setShows(allShows);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchEvents();

    fetchShows();

  }, []);

  /* =========================
      HANDLE INPUT
  ========================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================
      SUBMIT
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await api.put(
          `/shows/${editingId}`,
          {
            venue:
              formData.venue,
            date:
              formData.date,
            price:
              formData.price,
          }
        );

      } else {

        await api.post(
          "/shows",
          {
            eventId:
              formData.eventId,
            venue:
              formData.venue,
            date:
              formData.date,
            totalSeats:
              Number(
                formData.totalSeats
              ),
            price:
              Number(
                formData.price
              ),
          }
        );
      }

      setFormData({
        eventId: "",
        venue: "",
        date: "",
        totalSeats: "",
        price: "",
      });

      setEditingId(null);

      fetchShows();

    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
      EDIT
  ========================= */

  const handleEdit = (show) => {

    setEditingId(show._id);

    setFormData({
      eventId:
        show.event,
      venue:
        show.venue,
      date:
        show.date
          ?.slice(0, 16),
      totalSeats:
        show.totalSeats,
      price:
        show.price,
    });
  };

  /* =========================
      DELETE
  ========================= */

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this show?"
      );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/shows/${id}`
      );

      fetchShows();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="flex">

        {/* SIDEBAR */}

        <AdminSidebar />

        {/* CONTENT */}

        <div className="flex-1 p-8">

          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            Manage Shows
          </h1>

          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
            className="mb-10 rounded-3xl bg-white p-6 shadow-md"
          >

            <div className="grid gap-4 md:grid-cols-2">

              {/* EVENT */}

              <select
                name="eventId"
                value={
                  formData.eventId
                }
                onChange={
                  handleChange
                }
                className="rounded-xl border p-3"
                required
                disabled={
                  editingId
                }
              >

                <option value="">
                  Select Event
                </option>

                {events.map(
                  (event) => (
                    <option
                      key={
                        event._id
                      }
                      value={
                        event._id
                      }
                    >
                      {event.name}
                    </option>
                  )
                )}

              </select>

              {/* VENUE */}

              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={
                  formData.venue
                }
                onChange={
                  handleChange
                }
                className="rounded-xl border p-3"
                required
              />

              {/* DATE */}

              <input
                type="datetime-local"
                name="date"
                value={
                  formData.date
                }
                onChange={
                  handleChange
                }
                className="rounded-xl border p-3"
                required
              />

              {/* TOTAL SEATS */}

              <input
                type="number"
                name="totalSeats"
                placeholder="Total Seats"
                value={
                  formData.totalSeats
                }
                onChange={
                  handleChange
                }
                className="rounded-xl border p-3"
                required
                disabled={
                  editingId
                }
              />

              {/* PRICE */}

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={
                  formData.price
                }
                onChange={
                  handleChange
                }
                className="rounded-xl border p-3"
                required
              />

            </div>

            <button
              type="submit"
              className="mt-5 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >

              {editingId
                ? "Update Show"
                : "Create Show"}

            </button>

          </form>

          {/* SHOW LIST */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {shows.map(
              (show) => (

                <div
                  key={
                    show._id
                  }
                  className="rounded-3xl bg-white p-6 shadow-md"
                >

                  <h2 className="text-2xl font-bold text-gray-900">
                    {
                      show.eventName
                    }
                  </h2>

                  <p className="mt-2 text-gray-600">
                    📍 {
                      show.venue
                    }
                  </p>

                  <p className="mt-2 text-gray-600">
                    📅{" "}
                    {new Date(
                      show.date
                    ).toLocaleString()}
                  </p>

                  <p className="mt-2 text-gray-600">
                    🎟️ Seats:{" "}
                    {
                      show.totalSeats
                    }
                  </p>

                  <p className="mt-2 font-semibold text-green-600">
                    ₹{
                      show.price
                    }
                  </p>

                  <div className="mt-6 flex gap-3">

                    <button
                      onClick={() =>
                        handleEdit(
                          show
                        )
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          show._id
                        )
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-white"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminShows;