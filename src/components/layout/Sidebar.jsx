import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, User, Settings, LogOut } from "lucide-react";
import logo from "../../assets/logo.webp";

export default function Sidebar() {
    const linkClass ="flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors";
    const activeClass = "bg-[#7C5CFF] text-white";
    const inactiveClass = "text-gray-300 hover:bg-white/10 hover:text-white";

    return (
        <div className="w-64 h-full bg-[#504A6E] text-white flex flex-col justify-between">
            {/* Top Section */}
            <div>
                {/* Logo */}
                <div className="p-6 flex justify-center">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="h-14 w-14 rounded-full object-cover border-2 border-white/20"
                    />
                </div>

                {/* MAIN MENU */}
                <p className="px-6 text-xs text-gray-300 tracking-widest mb-2">
                    MAIN MENU
                </p>

                <nav className="px-4 space-y-2">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `${linkClass} ${isActive ? activeClass : inactiveClass}`
                        }
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            `${linkClass} ${isActive ? activeClass : inactiveClass}`
                        }
                    >
                        <User size={18} />
                        User Management
                    </NavLink>

                    <NavLink
                        to="/team"
                        className={({ isActive }) =>
                            `${linkClass} ${isActive ? activeClass : inactiveClass}`
                        }
                    >
                        <Users size={18} />
                        Team
                    </NavLink>
                </nav>

                {/* SETTINGS */}
                <p className="px-6 mt-6 text-xs text-gray-300 tracking-widest mb-2">
                    SETTINGS
                </p>

                <nav className="px-4">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `${linkClass} ${isActive ? activeClass : inactiveClass}`
                        }
                    >
                        <Settings size={18} />
                        Settings
                    </NavLink>
                </nav>
            </div>

            {/* Logout Bottom */}
            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 text-gray-300 hover:text-white">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
}