import React, { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios"; // Your configured axios instance

const languages = [
    "English", "Hindi", "Spanish", "French", "German",
    "Chinese", "Arabic", "Bengali", "Japanese", "Russian",
];

export default function RegisterPage() {
    const [nativeLang, setNativeLang] = useState("");
    const [desiredLang, setDesiredLang] = useState("");
    
    // State for the image preview URL (matches your original `profilePic` state)
    const [profilePicPreview, setProfilePicPreview] = useState("https://ui-avatars.com/api/?name=User&background=random");
    // ✅ NEW STATE: State to hold the actual file object for submission
    const [profilePicFile, setProfilePicFile] = useState(null); 

    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // File upload preview handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file); // ✅ Store the actual file object
            const imageUrl = URL.createObjectURL(file);
            setProfilePicPreview(imageUrl); // Update the preview image source
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    // Mutation with axiosInstance
    const registerMutation = useMutation({
        mutationFn: async (formData) => {
            // Axios will automatically set the correct 'Content-Type: multipart/form-data' header
            // when a FormData object is passed as data.
            const { data } = await axiosInstance.post("/auth/register", formData);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Registration successful ✅");
            navigate("/login");
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || "Registration failed ❌";
            toast.error(errorMsg);
            setErrors({ server: errorMsg });
        },
    });

    // Real-time validation
    const validateField = (name, value) => {
        let errorMsg = "";

        if (name === "fullname") {
            if (!/^[A-Za-z\s]+$/.test(value)) {
                errorMsg = "Full name must only contain alphabets";
            }
        }

        if (name === "email") {
            if (!/\S+@\S+\.\S+/.test(value)) {
                errorMsg = "Invalid email format";
            }
        }

        if (name === "password") {
            if (value.length < 6) {
                errorMsg = "Password must be at least 6 characters";
            }
        }

        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ IMPORTANT: Create a FormData object to send file and text data
        const formData = new FormData();

        // ✅ Append all text fields to FormData
        formData.append("username", e.target.username.value.trim());
        formData.append("fullname", e.target.fullname.value.trim());
        formData.append("email", e.target.email.value.trim());
        formData.append("password", e.target.password.value.trim());
        formData.append("bio", e.target.bio.value.trim());
        formData.append("city", e.target.city.value.trim());
        formData.append("nativeLanguage", nativeLang);
        formData.append("desiredLanguage", desiredLang);

        // ✅ Append the actual file object if one was selected
        // The key 'profilePic' here MUST match the field name used in your Multer middleware:
        // router.post("/register", upload.single("profilePic"), register);
        if (profilePicFile) {
            formData.append("profilePic", profilePicFile);
        }
        // If no file is selected, Multer will receive an empty 'profilePic' field,
        // and your backend logic will correctly use the default image.
        
        // Remove the old 'avatar' object as it's no longer needed in the schema/payload
        // const formData = { /* ... */ avatar: { url: profilePic, ... } }; // This is no longer needed

        registerMutation.mutate(formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
                <form className="card-body" onSubmit={handleSubmit}>
                    {/* Avatar Upload */}
                    <div className="flex justify-center mb-4">
                        <div className="avatar cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                {/* ✅ Use profilePicPreview for the image source */}
                                <img src={profilePicPreview} alt="Profile" />
                            </div>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <label className="label"><span className="label-text">Username</span></label>
                    <input type="text" name="username" className="input input-bordered" required />

                    <label className="label"><span className="label-text">Full Name</span></label>
                    <input
                        type="text"
                        name="fullname"
                        className="input input-bordered"
                        required
                        onChange={(e) => validateField("fullname", e.target.value)}
                    />
                    {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}

                    <label className="label"><span className="label-text">Email</span></label>
                    <input
                        type="email"
                        name="email"
                        className="input input-bordered"
                        required
                        onChange={(e) => validateField("email", e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <label className="label"><span className="label-text">Password</span></label>
                    <input
                        type="password"
                        name="password"
                        className="input input-bordered"
                        required
                        minLength={6}
                        onChange={(e) => validateField("password", e.target.value)}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    <label className="label"><span className="label-text">City</span></label>
                    <input type="text" name="city" className="input input-bordered" required />

                    <label className="label"><span className="label-text">Native Language</span></label>
                    <select
                        className="select select-bordered"
                        value={nativeLang}
                        onChange={(e) => setNativeLang(e.target.value)}
                        required
                    >
                        <option value="">Select your native language</option>
                        {languages.map((lang) => (
                            <option key={`native-${lang}`} value={lang}>{lang}</option>
                        ))}
                    </select>

                    <label className="label"><span className="label-text">Desired Language</span></label>
                    <select
                        className="select select-bordered"
                        value={desiredLang}
                        onChange={(e) => setDesiredLang(e.target.value)}
                        required
                    >
                        <option value="">Select desired language</option>
                        {languages.map((lang) => (
                            <option key={`desired-${lang}`} value={lang}>{lang}</option>
                        ))}
                    </select>

                    <label className="label"><span className="label-text">Bio</span></label>
                    <textarea name="bio" className="textarea textarea-success" required />

                    {/* Buttons */}
                    <div className="form-control mt-6 flex flex-row gap-4">
                        <button type="submit" className="btn btn-secondary" disabled={registerMutation.isLoading}>
                            {registerMutation.isLoading ? "Submitting..." : "Submit"}
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}