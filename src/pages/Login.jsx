import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import axios from "axios";
import bg from "../assets/login-bg.png.gif";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const isValid = form.email && form.password;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError("");
            const formData = new FormData();
            formData.append("email", form.email);
            formData.append("password", form.password);

            const res = await axios.post(
                "http://13.210.33.250/api/login",
                formData,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            console.log("SUCCESS", res.data);
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("company_id", res.data.companies[0].id);
            navigate("/users");

        } catch (err) {
            console.log("FULL ERROR ", err);

            if (err.response) {
                console.log("BACKEND ERROR ", err.response.data);
            } else if (err.request) {
                console.log("NO RESPONSE FROM SERVER ", err.request);
            } else {
                console.log("AXIOS ERROR ", err.message);
            }

            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-black bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* TOP HEADING */}
            <h1 className="absolute top-24 text-white text-4xl font-semibold tracking-wide">
                LOGIN
            </h1>

            {/* Card */}
            <div className="w-[402px] h-[398px] backdrop-blur-md bg-white/10 border border-white/20 rounded-[5px] p-6 space-y-5">

                {/* Heading */}
                <h2 className="text-white text-[24px] font-medium">
                    Sign in
                    <span className="block text-sm font-normal text-white/70 mt-1">
                        Login to manage your account
                    </span>
                </h2>

                {/* Email */}
                <div>
                    <label className="text-white text-sm">Email</label>

                    <div className="relative mt-1">
                        <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-lg" />

                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            value={form.email}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 outline-none"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="text-white text-sm">Password</label>

                    <div className="relative mt-1">
                        <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-lg" />

                        <input
                            name="password"
                            type={show ? "text" : "password"}
                            onChange={handleChange}
                            value={form.password}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-10 py-2 rounded-md bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-violet-500"
                        />

                        {/* Eye icon */}
                        <div
                            onClick={() => setShow(!show)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 cursor-pointer"
                        >
                            {show ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm text-white">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        Remember me
                    </label>

                    <span className="cursor-pointer">Forgot password?</span>
                </div>

                {/* Button */}
                <button
                    onClick={handleLogin}
                    disabled={!isValid || loading}
                    className="w-full py-2 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
}