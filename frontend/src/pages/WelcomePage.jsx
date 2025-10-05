import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export default function WelcomePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success"
  const [message, setMessage] = useState("");
  const verifiedRef = useRef(false); // ✅ prevents double API call in React 18 StrictMode

  useEffect(() => {
    if (!token) {
      toast.error("Invalid token");
      navigate("/register");
      return;
    }

    const verifyUser = async () => {
      if (verifiedRef.current) return; // prevent double execution
      verifiedRef.current = true;

      try {
        const response = await axiosInstance.post(`/auth/verify/${token}`);
        setStatus("success");
        setMessage(response.data.message || "Welcome! Your email is verified.");
        toast.success(response.data.message || "Email verified successfully!");
      } catch (error) {
        const errMsg = error.response?.data?.message || "Verification failed";
        toast.error(errMsg);
        navigate("/register"); // redirect automatically on error
      }
    };

    verifyUser();
  }, [token, navigate]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <p className="text-lg font-medium">Verifying your email...</p>
      </div>
    );
  }

  // Success state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <h1 className="text-3xl font-bold mb-4">Welcome 🎉</h1>
      <p className="text-lg">{message}</p>
      <button
        className="btn btn-primary mt-6"
        onClick={() => navigate("/login")}
      >
        Go to Login
      </button>
    </div>
  );
}
