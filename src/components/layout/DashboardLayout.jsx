import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-[#1F1A36] text-white min-h-screen">
                <Sidebar />
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}