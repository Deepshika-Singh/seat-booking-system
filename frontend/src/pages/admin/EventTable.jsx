const EventTable = ({
  events,
  loading,
  onDelete,
  onEdit,
}) => {

  if (loading) {
    return (
      <p>
        Loading events...
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4 text-left">
              Name
            </th>

            <th className="p-4 text-left">
              Type
            </th>

            <th className="p-4 text-left">
              Description
            </th>

            <th className="p-4 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {events.map((event) => (

            <tr
              key={event._id}
              className="border-t"
            >

              <td className="p-4 font-semibold">
                {event.name}
              </td>

              <td className="p-4 capitalize">
                {event.eventType}
              </td>

              <td className="p-4">
                {event.description}
              </td>

              <td className="space-x-3 p-4">

                <button
                  onClick={() =>
                    onEdit(event)
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(event._id)
                  }
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
};

export default EventTable;