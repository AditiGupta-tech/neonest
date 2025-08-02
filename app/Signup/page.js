"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  useEffect(() => {
    document.title = "Signup | NeoNest";
  }, []);

  const router = useRouter();
  const { login } = useAuth();

  // State for input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State for validation errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // State to track if an input field has been "touched" (interacted with)
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Function to validate name
  const validateName = (nameValue) => {
    if (!nameValue.trim()) {
      setNameError("Name cannot be empty.");
      return false;
    }
    if (nameValue.trim().length < 2) {
      setNameError("Name must be at least 2 characters.");
      return false;
    }
    setNameError("");
    return true;
  };

  // Function to validate email
  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      setEmailError("Email cannot be empty.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Function to validate password
  const validatePassword = (passwordValue) => {
    if (!passwordValue.trim()) {
      setPasswordError("Password cannot be empty.");
      return false;
    }
    if (passwordValue.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return false;
    }
    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(passwordValue);
    const hasNumber = /\d/.test(passwordValue);
    if (!hasLetter || !hasNumber) {
      setPasswordError(
        "Password must contain at least one letter and one number."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Handle changes for each input with immediate validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (nameTouched) validateName(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailTouched) validateEmail(value);
    // Clear the specific "Email already exists" error when email changes
    if (emailError.includes("Email already exists")) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordTouched) validatePassword(value);
  };

  // Determine if the form is valid and button should be enabled
  const isFormValid = useMemo(() => {
    const nameIsValid = validateName(name);
    const emailIsValid = validateEmail(email);
    const passwordIsValid = validatePassword(password);
    return nameIsValid && emailIsValid && passwordIsValid;
  }, [name, email, password]);

  const handleNext = async (e) => {
    e.preventDefault();

    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);

    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!nameValid || !emailValid || !passwordValid) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      const userData = {
        name: name,
        email: email,
        password: password,
      };

      const res = await axios.post("/api/auth/signup", userData);

      const data = res.data;

      if (res.status === 201) {
        console.log(data);
        login(data.token);

        toast.success(data.success);
        router.push(`/signupbaby`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const backendError = err.response.data.error;
        toast.error(backendError || "An unexpected error occurred.");

        if (backendError && backendError.includes("Email already exists")) {
          // Set the specific error message to be rendered with the link
          setEmailError("Email already exists! Login instead.");
          setEmailTouched(true);
        }
      } else {
        toast.error("Network error or unexpected problem.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 relative">
      {/* Background shadow for depth */}
      <div className="absolute inset-0 bg-black opacity-5 blur-3xl"></div>
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <form
          onSubmit={handleNext}
          className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div
                className="p-3 bg-pink-100 rounded-full hover:bg-pink-200 transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-xl"
                style={{
                  boxShadow:
                    "0 10px 15px -3px rgba(236, 72, 153, 0.2), 0 4px 6px -2px rgba(236, 72, 153, 0.1)",
                }}
              >
                {/* NeoNest Logo */}
                <svg
                  className="w-12 h-12 hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Pink gradient background circle */}
                  <defs>
                    <linearGradient
                      id="logoGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#fce7f3", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#f9a8d4", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>

                  {/* Main circle background */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="url(#logoGradient)"
                    stroke="#ec4899"
                    strokeWidth="2"
                    className="hover:stroke-pink-500 transition-colors duration-300"
                  />

                  {/* Left adult figure (blue) */}
                  <path
                    d="M25 35 Q20 45 25 55 Q30 65 35 60 Q40 55 35 45 Q30 35 25 35"
                    fill="#3b82f6"
                    opacity="0.8"
                    className="hover:fill-blue-500 transition-colors duration-300"
                  />

                  {/* Right adult figure (pink) */}
                  <path
                    d="M75 35 Q80 45 75 55 Q70 65 65 60 Q60 55 65 45 Q70 35 75 35"
                    fill="#ec4899"
                    opacity="0.8"
                    className="hover:fill-pink-500 transition-colors duration-300"
                  />

                  {/* Heart shape formed by the figures */}
                  <path
                    d="M35 45 Q50 35 65 45 Q50 55 35 45"
                    fill="#ec4899"
                    opacity="0.9"
                    className="hover:fill-pink-500 transition-colors duration-300"
                  />

                  {/* Baby figure (light skin tone) */}
                  <ellipse
                    cx="50"
                    cy="48"
                    rx="8"
                    ry="6"
                    fill="#fbbf24"
                    opacity="0.9"
                    className="hover:fill-yellow-400 transition-colors duration-300"
                  />
                  <circle cx="47" cy="46" r="1" fill="#1f2937" />
                  <circle cx="53" cy="46" r="1" fill="#1f2937" />
                  <path
                    d="M48 50 Q50 52 52 50"
                    stroke="#1f2937"
                    strokeWidth="0.5"
                    fill="none"
                  />

                  {/* Baby's arms */}
                  <path
                    d="M42 48 Q40 50 42 52"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    fill="none"
                    className="hover:stroke-yellow-400 transition-colors duration-300"
                  />
                  <path
                    d="M58 48 Q60 50 58 52"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    fill="none"
                    className="hover:stroke-yellow-400 transition-colors duration-300"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 hover:from-pink-700 hover:to-purple-700 transition-all duration-300">
              Join NeoNest
            </h1>
            <p className="text-gray-600 text-sm hover:text-gray-700 transition-colors duration-300">
              Create your account to start your parenting journey
            </p>
          </div>

          {/* Name Field */}
          <div className="mb-6 group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
              Full Name
            </label>
            <div
              className={`flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:ring-2 focus-within:bg-white transition-all duration-300 hover:bg-gray-100 hover:border-pink-300 group shadow-sm hover:shadow-md
              ${
                nameError && nameTouched
                  ? "border-red-500 focus-within:ring-red-400"
                  : "border-gray-300 focus-within:ring-pink-400"
              }
            `}
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
            >
              <User className="w-5 h-5 text-gray-400 mr-3 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={handleNameChange}
                onBlur={() => setNameTouched(true)}
                required
                className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 group-hover:placeholder-gray-600 transition-colors duration-300"
              />
            </div>
            {nameError && nameTouched && (
              <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {nameError}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-6 group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
              Email Address
            </label>
            <div
              className={`flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:ring-2 focus-within:bg-white transition-all duration-300 hover:bg-gray-100 hover:border-pink-300 group shadow-sm hover:shadow-md
              ${
                emailError && emailTouched
                  ? "border-red-500 focus-within:ring-red-400"
                  : "border-gray-300 focus-within:ring-pink-400"
              }
            `}
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
            >
              <Mail className="w-5 h-5 text-gray-400 mr-3 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setEmailTouched(true)}
                required
                className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 group-hover:placeholder-gray-600 transition-colors duration-300"
              />
            </div>
            {emailError && emailTouched && (
              <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {emailError.includes("Email already exists") ? (
                  <>
                    Email already exists!{" "}
                    <span
                      onClick={() => router.push("/Login")}
                      className="text-pink-600 italic cursor-pointer hover:underline font-medium hover:text-pink-700 transition-colors duration-300"
                    >
                      Login
                    </span>{" "}
                    instead.
                  </>
                ) : (
                  emailError
                )}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6 group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
              Password
            </label>
            <div
              className={`flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:ring-2 focus-within:bg-white transition-all duration-300 hover:bg-gray-100 hover:border-pink-300 group shadow-sm hover:shadow-md
              ${
                passwordError && passwordTouched
                  ? "border-red-500 focus-within:ring-red-400"
                  : "border-gray-300 focus-within:ring-pink-400"
              }
            `}
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
            >
              <Lock className="w-5 h-5 text-gray-400 mr-3 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)}
                required
                className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 group-hover:placeholder-gray-600 transition-colors duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-pink-500 transition-colors duration-300 hover:scale-110 transform"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 hover:text-gray-600 transition-colors duration-300">
              Password must be at least 6 characters with letters and numbers.
            </p>
            {passwordError && passwordTouched && (
              <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {passwordError}
              </p>
            )}
          </div>

          {/* Privacy Notice */}
          <div
            className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-[1.02] group shadow-md hover:shadow-lg"
            style={{
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <p className="text-sm text-blue-800 leading-relaxed group-hover:text-blue-900 transition-colors duration-300">
              <span className="font-medium">Privacy Notice:</span> At NeoNest,
              your data privacy is paramount. We are committed to keeping your
              information confidential and do not share it with third parties.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform
              ${
                isFormValid
                  ? "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-pink-200"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
            style={{
              boxShadow: isFormValid
                ? "0 10px 15px -3px rgba(236, 72, 153, 0.3), 0 4px 6px -2px rgba(236, 72, 153, 0.2)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {isFormValid ? "Create Account" : "Please fill all fields"}
          </button>

          {/* Login Link */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/Login"
              className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300 hover:underline"
            >
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
