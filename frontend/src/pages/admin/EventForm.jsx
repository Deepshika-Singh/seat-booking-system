import { useEffect, useState } from "react";

import api from "../../services/api";

const EventForm = ({
  fetchEvents,
  editingEvent,
  setEditingEvent,
}) => {

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      eventType: "movie",
    });

  useEffect(() => {

    if (editingEvent) {

      setFormData({
        name:
          editingEvent.name || "",
        description:
          editingEvent.description || "",
        eventType:
          editingEvent.eventType ||
          "movie",
      });
    }

  }, [editingEvent]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingEvent) {

        await api.put(
          `/events/${editingEvent._id}`,
          formData
        );

      } else {

        await api.post(
          "/events",
          formData
        );
      }

      setFormData({
        name: "",
        description: "",
        eventType: "movie",
      });

      setEditingEvent(null);

      fetchEvents();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">

      <h2 className="mb-6 text-2xl font-bold">

        {editingEvent
          ? "Update Event"
          : "Create Event"}

      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-xl border p-3 outline-none focus:border-red-500"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-xl border p-3 outline-none focus:border-red-500"
          required
        />

        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          className="w-full rounded-xl border p-3 outline-none focus:border-red-500"
        >

          <option value="movie">
            Movie
          </option>

          <option value="concert">
            Concert
          </option>

          <option value="theater">
            Theater
          </option>

        </select>

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >

          {editingEvent
            ? "Update Event"
            : "Create Event"}

        </button>

      </form>
    </div>
  );
};

export default EventForm;