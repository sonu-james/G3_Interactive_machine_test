import { Bell } from "lucide-react";

export default function Topbar() {
    return (
        <div className="h-16 bg-white flex items-center justify-between px-6 border-b border-gray-200">

            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-800">
                Jobs Management
            </h1>

            {/* Right Section */}
            <div className="flex items-center gap-5">

                {/* Notification */}
                <div className="relative">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
                        <Bell size={18} className="text-gray-600" />
                    </div>

                    {/* Green dot */}
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                </div>

                {/* Profile Image */}
                <img
                    src="https://i.pravatar.cc/150?img=3"
                    alt="Admin"
                    className="w-9 h-9 rounded-full object-cover"
                />
            </div>
        </div>
    );
}