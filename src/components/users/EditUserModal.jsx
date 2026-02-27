import { FiX } from "react-icons/fi";

export default function EditUserModal({
    show,
    setShow,
    form,
    setForm,
    handleUpdateUser,
    saving,
    errors = {},
    roles = [],
    responsibilities = []
}) {
    if (!show) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleResponsibility = (id) => {
        const updated = form.responsibilities.includes(id)
            ? form.responsibilities.filter((r) => r !== id)
            : [...form.responsibilities, id];

        setForm({ ...form, responsibilities: updated });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, profile_image: file });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative">
                <FiX
                    className="absolute right-4 top-4 cursor-pointer"
                    onClick={() => setShow(false)}
                />

                <h2 className="text-lg font-semibold mb-4">Edit User</h2>

                {/* IMAGE */}
                <div className="flex flex-col items-center mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border flex items-center justify-center">
                        <img
                            src={
                                form.profile_image
                                    ? URL.createObjectURL(form.profile_image)
                                    : form.preview
                            }
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <label className="text-violet-600 text-sm mt-2 cursor-pointer">
                        Upload
                        <input hidden type="file" onChange={handleImageUpload} />
                    </label>

                </div>

                {/* FORM */}
                <div className="grid grid-cols-2 gap-4">

                    <Input
                        label="Name"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        error={errors.first_name}
                    />

                    <Input
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="Phone Number"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                    />

                    <Input
                        label="Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    <Input
                        label="Initials"
                        name="initials"
                        value={form.initials}
                        onChange={handleChange}
                    />

                    {/* ROLE */}
                    <div>
                        <label className="text-sm font-medium">Role *</label>

                        <select
                            name="role_id"
                            value={form.role_id}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded-md p-2 text-sm"
                        >
                            <option value="">Select role</option>

                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.title}
                                </option>
                            ))}
                        </select>

                        {errors.role_id && (
                            <p className="text-red-500 text-xs">{errors.role_id}</p>
                        )}
                    </div>

                </div>

                {/* RESPONSIBILITIES */}
                <div className="mt-4">
                    <label className="text-sm font-medium">Designation *</label>

                    <div className="flex flex-wrap gap-6 mt-2 text-sm">

                        {responsibilities.map((item) => (
                            <label key={item.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.responsibilities.includes(item.id)}
                                    onChange={() => toggleResponsibility(item.id)}
                                />
                                {item.title}
                            </label>
                        ))}

                    </div>

                    {errors.responsibilities && (
                        <p className="text-red-500 text-xs">
                            {errors.responsibilities}
                        </p>
                    )}
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleUpdateUser}
                    disabled={saving}
                    className="w-full mt-6 py-3 rounded-md text-white bg-gradient-to-r from-violet-500 to-indigo-500"
                >
                    {saving ? "Updating..." : "Save"}
                </button>

            </div>
        </div>
    );
}

function Input({ label, name, value, onChange, error }) {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>

            <input
                name={name}
                value={value || ""}
                onChange={onChange}
                className={`w-full mt-1 border rounded-md p-2 text-sm ${error ? "border-red-500" : ""
                    }`}
            />

            {error && (
                <p className="text-red-500 text-xs">{error}</p>
            )}
        </div>
    );
}