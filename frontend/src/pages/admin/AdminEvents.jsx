import { useEffect, useState } from "react";
import api from "../../services/api";

import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminEvents = () => {

  const [events, setEvents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventType: "movie",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data.data || response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, formData);
      } else {
        await api.post("/events", formData);
      }

      setFormData({
        name: "",
        description: "",
        eventType: "movie",
      });

      setEditingId(null);

      fetchEvents();

    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);

    setFormData({
      name: event.name,
      description: event.description,
      eventType: event.eventType,
    });
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this event?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="flex">

        <AdminSidebar />

        <div className="flex-1 p-8">

          <h1 className="mb-8 text-4xl font-bold">
            Manage Events
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mb-10 rounded-3xl bg-white p-6 shadow-md"
          >

            <div className="grid gap-4 md:grid-cols-2">

              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-xl border p-3"
                required
              />

              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="rounded-xl border p-3"
              >
                <option value="movie">Movie</option>
                <option value="concert">Concert</option>
                <option value="theater">Theater</option>
              </select>

            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="mt-4 w-full rounded-xl border p-3"
              rows="4"
            />

            <button
              type="submit"
              className="mt-5 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white"
            >
              {editingId ? "Update Event" : "Create Event"}
            </button>

          </form>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {events.map((event) => (

              <div
                key={event._id}
                className="rounded-3xl bg-white p-6 shadow-md"
              >

                <h2 className="text-2xl font-bold text-gray-900">
                  {event.name}
                </h2>

                <p className="mt-2 text-gray-600">
                  {event.description}
                </p>

                <p className="mt-3 font-semibold text-red-600">
                  {event.eventType}
                </p>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() => handleEdit(event)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(event._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminEvents;