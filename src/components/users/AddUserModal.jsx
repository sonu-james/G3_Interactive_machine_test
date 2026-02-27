import { FiX } from "react-icons/fi";

export default function AddUserModal({
  show,
  setShow,
  form,
  setForm,
  handleAddUser,
  errors = {},
  roles = [],
  saving, responsibilities = [],
}) {
  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhone = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setForm({ ...form, phone_number: value });
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

  const removeImage = () => {
    setForm({ ...form, profile_image: null });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">

      <div className="relative bg-white w-full max-w-2xl rounded-lg p-6">

        {/* Close */}
        <FiX
          className="absolute right-4 top-4 cursor-pointer text-gray-500"
          onClick={() => setShow(false)}
        />

        <h2 className="text-lg font-semibold mb-4">Add New User</h2>

        <div className="flex flex-col items-center mb-4">

          <div className="w-20 h-20 rounded-full border overflow-hidden flex items-center justify-center">
            {form.profile_image ? (
              <img
                src={URL.createObjectURL(form.profile_image)}
                className="w-full h-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>

          <div className="flex gap-3 mt-2 text-sm">

            <label className="cursor-pointer text-violet-600">
              Upload
              <input hidden type="file" onChange={handleImageUpload} />
            </label>

            {form.profile_image && (
              <button onClick={removeImage} className="text-red-500">
                Delete
              </button>
            )}

          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">

          <Input
            label="Name*"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            error={errors.first_name}
          />

          <Input
            label="Email*"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Phone Number"
            name="phone_number"
            value={form.phone_number}
            onChange={handlePhone}
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
            <label className="text-sm font-medium">
              Role <span className="text-red-500">*</span>
            </label>

            <select
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md p-2 text-sm"
            >
              <option value="">Select role</option>

              {Array.isArray(roles) &&
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
            </select>

            {errors.role_id && (
              <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>
            )}
          </div>
        </div>

        {/* DESIGNATION */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            Designation *
          </label>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-3">

            {responsibilities?.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  checked={form.responsibilities.includes(item.id)}
                  onChange={() => toggleResponsibility(item.id)}
                />

                {item.title}
              </label>
            ))}

          </div>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleAddUser}
          disabled={saving}
          className="w-full mt-6 py-3 rounded-md text-white font-medium
                     bg-gradient-to-r from-violet-500 to-indigo-500"
        >
          {saving ? "Saving..." : "Add New User"}
        </button>

      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className={`w-full mt-1 border rounded-md p-2 text-sm 
        ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}