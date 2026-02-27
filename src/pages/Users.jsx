import DashboardLayout from "../components/layout/DashboardLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import AddUserModal from "../components/users/AddUserModal";
import DeleteModal from "../components/users/DeleteModal";
import EditUserModal from "../components/users/EditUserModal";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [responsibilities, setResponsibilityList] = useState([]);
    const [roles, setRoles] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        role_id: "",
        title: "",
        initials: "",
        responsibilities: [],
        profile_image: null,
    });

    //filteration and search
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === ""
                ? true
                : statusFilter === "active"
                    ? user.status === true
                    : user.status === false;

        return matchesSearch && matchesStatus;
    });


    //pagination code 
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    //validation fields
    const validate = () => {
        const newErrors = {};
        if (!form.first_name) newErrors.first_name = "Name is required";
        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!form.role_id) newErrors.role_id = "Role is required";

        if (form.responsibilities.length === 0) {
            newErrors.responsibilities = "Select at least one responsibility";
        }

        if (form.phone_number && !/^\d{10,15}$/.test(form.phone_number)) {
            newErrors.phone_number = "Phone number must contain only digits (10–15).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //get responsibilities
    const getResponsibilities = async () => {
        const res = await api.get("/user/dropdown-responsibility");
        setResponsibilityList(res.data);
    };

    //get roles 
    const getRoles = async () => {
        try {
            const formData = new FormData();
            formData.append("type", "0");
            const res = await api.post("/role/dropdown", formData);
            console.log("ROLE DROPDOWN ", res.data);
            // convert object → array
            const rolesArray = Object.entries(res.data.data).map(
                ([title, id]) => ({
                    id,
                    title
                })
            );
            setRoles(rolesArray);
        } catch (err) {
            console.log("ROLE ERROR ", err.response?.data || err);
        }
    };

    // GET USERS
    const getUsers = async () => {
        try {
            const res = await api.get("/user?status=1");
            const formattedUsers = res.data.data.map((u) => ({
                ...u,
                phone_number: u.phone,
                role_id: u.role?.id, //  store role_id for update API
                status: u.status === 1,   // ⭐ convert to boolean
            }));
            setUsers(formattedUsers);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
        getResponsibilities();
        getRoles();
    }, []);


    //Delete user
    const handleDeleteUser = async () => {
        try {
            setDeleting(true);
            const formData = new FormData();
            formData.append("_method", "DELETE");
            await api.post(`/user/${selectedUserId}`, formData);
            toast.success("User deleted successfully");
            setUsers((prev) =>
                prev.filter((user) => user.id !== selectedUserId)
            );
            setDeleteModal(false);
        } catch (err) {
            console.log(err.response?.data);
            toast.error("Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    // ✅ ADD USER
    const handleAddUser = async () => {
        if (!validate()) return;
        try {
            setSaving(true);
            const data = new FormData();
            data.append("name", form.first_name);
            data.append("email", form.email);
            data.append("role", form.role_id);
            data.append("phone", form.phone_number || "");
            data.append("title", form.title || "");
            data.append("initials", form.initials || "");
            data.append("overwite_data", "1");
            // designation / responsibilities
            data.append(
                "responsibilities",
                JSON.stringify(form.responsibilities)
            );
            //  profile image
            if (form.profile_image instanceof File) {
                data.append("user_picture", form.profile_image);
            }
            await api.post("/user", data);
            toast.success("User added successfully");
            //  refresh table
            await getUsers();
            //  close modal
            setShowModal(false);
            // reset form
            setForm({
                first_name: "",
                last_name: "",
                email: "",
                phone_number: "",
                role_id: "",
                title: "",
                initials: "",
                responsibilities: [],
                profile_image: null,
            });
            //clear errors
            setErrors({});

        } catch (err) {
            console.log("STATUS ", err.response?.status);
            console.log("BACKEND ", err.response?.data);

            // MAP LARAVEL ERRORS TO UI
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                toast.error("Something went wrong");
            }

        } finally {
            setSaving(false);
        }
    };

    //Update User
    const handleUpdateUser = async () => {
        console.log('hello');
        if (!validate()) return;
        try {
            setSaving(true);
            const data = new FormData();
            data.append("_method", "PUT");
            data.append("name", form.first_name);
            data.append("email", form.email);
            data.append("role", form.role_id);
            data.append("phone", form.phone_number || "");
            data.append("title", form.title || "");
            data.append("initials", form.initials || "");
            data.append("overwite_data", "1");
            data.append(
                "responsibilities",
                JSON.stringify(form.responsibilities)
            );

            if (form.profile_image instanceof File) {
                data.append("user_picture", form.profile_image);
            }

            await api.post(`/user/${editingUser.id}`, data);
            toast.success("User updated successfully");
            setEditModal(false);
            getUsers();

        } catch (err) {
            console.log(err.response?.data);
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (user) => {
        const newStatus = !user.status;
        // Optimistic UI update (toggle immediately)
        setUsers((prevUsers) =>
            prevUsers.map((u) =>
                u.id === user.id ? { ...u, status: newStatus } : u
            )
        );

        const formData = new FormData();
        formData.append("name", user.first_name);
        formData.append("email", user.email);
        formData.append("role", user.role_id);
        formData.append("status", newStatus ? 1 : 0);

        try {
            await api.post(`/user/${user.id}?_method=PUT`, formData);

            toast.success("Status updated");
        } catch (error) {
            console.log("STATUS UPDATE ERROR 👉", error.response?.data);

            // rollback UI if API fails
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === user.id ? { ...u, status: !newStatus } : u
                )
            );

            toast.error("Failed to update status");
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
                {/* Top Controls */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search by name, email.."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // reset pagination
                            }}
                            className="border rounded-md px-3 py-2 w-64 text-sm outline-none"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border rounded-md px-3 py-2 text-sm"
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                        + Add New User
                    </button>
                </div>
                {/* Table */}
                <div className="overflow-x-auto border rounded-md">
                    <table className="w-full text-sm">
                        {/* Table Head */}
                        <thead className="bg-[#5B4B8A] text-[#E7E7E6]">
                            <tr>
                                <th className="px-3 py-2 text-left">SL</th>
                                <th className="px-3 py-2 text-left">Name</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-left">Initials</th>
                                <th className="px-3 py-2 text-left">Phone Number</th>
                                <th className="px-3 py-2 text-left">Role</th>
                                <th className="px-3 py-2 text-left">Status</th>
                                <th className="px-3 py-2 text-left">Title</th>
                                <th className="px-3 py-2 text-center">Action</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : (
                                currentUsers.map((user, index) => (
                                    <tr key={user.id} className="border-t hover:bg-gray-50 bg-white">

                                        <td className="px-3 py-2">{indexOfFirstUser + index + 1}</td>

                                        <td className="px-3 py-2">
                                            {user.first_name} {user.last_name}
                                        </td>

                                        <td className="px-3 py-2">{user.email}</td>

                                        <td className="px-3 py-2">
                                            {user.first_name?.charAt(0)}
                                        </td>
                                        <td className="px-3 py-2">{user.phone_number}</td>
                                        <td className="px-3 py-2">{user.role?.title}</td>
                                        {/* Status toggle */}
                                        <td className="px-3 py-2">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={!!user.status}   // ⭐ ensures boolean
                                                    onChange={() => handleStatusChange(user)}
                                                />
                                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-violet-500 transition-colors relative">

                                                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
                    transition-transform duration-300
                    peer-checked:translate-x-5">
                                                    </div>

                                                </div>
                                            </label>
                                        </td>
                                        <td className="px-3 py-2">{user.title}</td>
                                        <td className="px-3 py-2 text-center flex justify-center gap-3">
                                            <FiEdit onClick={() => {
                                                setEditingUser(user);
                                                setForm({
                                                    first_name: user.first_name || "",
                                                    email: user.email || "",
                                                    phone_number: user.phone_number || "",
                                                    role_id: user.role_id || "",
                                                    title: user.title || "",
                                                    initials: user.initials || "",
                                                    responsibilities:
                                                        user.responsibilities?.map((r) => r.id) || [],
                                                    profile_image: null,
                                                    preview: user.profile_image_url,
                                                });

                                                setEditModal(true);
                                            }} className="text-blue-500 cursor-pointer" />
                                            <FiTrash2 onClick={() => {
                                                setSelectedUserId(user.id);
                                                setDeleteModal(true);
                                            }} className="text-red-500 cursor-pointer" />
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <p>
                    Showing {indexOfFirstUser + 1} to{" "}
                    {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                    {filteredUsers.length} results
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-2 py-1 border rounded"
                    >
                        {"<"}
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-2 py-1 border rounded ${currentPage === i + 1 ? "bg-violet-500 text-white" : ""
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        className="px-2 py-1 border rounded"
                    >
                        {">"}
                    </button>
                </div>
            </div>


            <AddUserModal
                show={showModal}
                setShow={setShowModal}
                form={form}
                setForm={setForm}
                handleAddUser={handleAddUser}
                saving={saving}
                errors={errors}
                roles={roles}
                responsibilities={responsibilities}
            />
            <DeleteModal
                show={deleteModal}
                setShow={setDeleteModal}
                handleDelete={handleDeleteUser}
                deleting={deleting}
            />

            {/* update User Details */}
            <EditUserModal
                show={editModal}
                setShow={setEditModal}
                form={form}
                setForm={setForm}
                handleUpdateUser={handleUpdateUser}   // ⭐ change function
                saving={saving}
                errors={errors}
                responsibilities={responsibilities}
                roles={roles}
            />


        </DashboardLayout>
    );
}