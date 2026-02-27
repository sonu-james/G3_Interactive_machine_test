import { FiAlertCircle } from "react-icons/fi";

export default function DeleteModal({
    show,
    setShow,
    handleDelete,
    deleting
}) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 text-center relative">

                {/* ICON */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-red-500">
                        <FiAlertCircle className="text-red-500 text-2xl" />
                    </div>
                </div>

                {/* TEXT */}
                <h2 className="text-lg font-semibold mb-6">
                    Are you sure want to delete?
                </h2>

                {/* BUTTONS */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setShow(false)}
                        className="px-6 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50"
                    >
                        No, Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                        {deleting ? "Deleting..." : "Yes, Delete"}
                    </button>

                </div>
            </div>
        </div>
    );
}