import {
  LayoutDashboard,
  CalendarDays,
  Film,
  Ticket,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";

const stats = [
  {
    title: "Total Bookings",
    value: "1,248",
    icon: Ticket,
  },
  {
    title: "Revenue",
    value: "₹2.4L",
    icon: LayoutDashboard,
  },
  {
    title: "Events",
    value: "18",
    icon: CalendarDays,
  },
  {
    title: "Shows",
    value: "42",
    icon: Film,
  },
];

const AdminDashboard = () => {

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="flex">

        <AdminSidebar />

        <div className="flex-1 p-8">

          <div className="mb-8">

            <h1 className="text-4xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage events, shows and bookings
            </p>

          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl bg-white p-6 shadow-md"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-gray-500">
                        {item.title}
                      </p>

                      <h2 className="mt-2 text-4xl font-bold text-gray-900">
                        {item.value}
                      </h2>

                    </div>

                    <div className="rounded-2xl bg-red-100 p-4">

                      <Icon
                        size={28}
                        className="text-red-600"
                      />

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;