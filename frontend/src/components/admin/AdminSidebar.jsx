import {
  LayoutDashboard,
  CalendarDays,
  Film,
  Ticket,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {

  const location = useLocation();

  const menus = [
    {
      name: "Events",
      icon: CalendarDays,
      path: "/admin/events",
    },
    {
      name: "Shows",
      icon: Film,
      path: "/admin/shows",
    },
    
  ];

  return (
    <div className="min-h-screen w-72 bg-gray-900 p-6 text-white">

      <h1 className="mb-10 text-3xl font-bold text-red-500">
        Admin Panel
      </h1>

      <div className="space-y-3">

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (
            <Link
              key={menu.name}
              to={menu.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                location.pathname === menu.path
                  ? "bg-red-600"
                  : "hover:bg-gray-800"
              }`}
            >

              <Icon size={22} />

              <span className="font-semibold">
                {menu.name}
              </span>

            </Link>
          );
        })}

      </div>
    </div>
  );
};

export default AdminSidebar;