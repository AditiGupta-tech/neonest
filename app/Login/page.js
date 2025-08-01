"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

export default function LoginPage() {
  useEffect(() => {
    document.title = "Login | NeoNest";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { isAuth, login } = useAuth();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

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

  const validatePassword = (passwordValue) => {
    if (!passwordValue.trim()) {
      setPasswordError("Password cannot be empty.");
      return false;
    }
    if (passwordValue.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailTouched) validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordTouched) validatePassword(value);
  };

  const isFormValid = useMemo(() => {
    const emailIsValid = validateEmail(email);
    const passwordIsValid = validatePassword(password);
    return emailIsValid && passwordIsValid;
  }, [email, password]);

  async function handleSubmit(e) {
    e.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid || !passwordValid) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      const credentials = {
        email: email,
        password: password,
      };

      const res = await axios.post("/api/auth/login", credentials);

      const data = res.data;

      if (res.status === 200 && data.success) {
        login(data.token);

        toast.success(data.success);

        router.push("/");
      } else {
        toast.error(data.error || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const backendError = error.response.data.error;
        if (backendError === "no such user exists! signup instead") {
          toast.error(
            <>
              No such user exists!{" "}
              <span
                onClick={() => router.push("/Signup")}
                className="text-pink-600 italic cursor-pointer hover:underline"
              >
                Sign up
              </span>{" "}
              instead.
            </>
          );
        } else if (backendError === "wrong password") {
          toast.error("Invalid email or password.");
          setPasswordError("Incorrect password.");
          setPasswordTouched(true);
        } else if (backendError === "Please provide all details") {
          toast.error("Please enter both email and password.");
        } else {
          toast.error(backendError || "An unexpected error occurred.");
        }
      } else {
        toast.error("Network error or unexpected problem. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <ToastContainer />
      <div className="w-full max-w-md animate-fade-in">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 hover:from-pink-700 hover:to-purple-700 transition-all duration-300">
              Welcome Back to NeoNest!
            </h2>
            <p className="text-gray-600 text-sm hover:text-gray-700 transition-colors duration-300">
              Sign in to continue your parenting journey
            </p>
          </div>

          {/* Email Field */}
          <div className="mb-6 group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
              Email Address
            </label>
            <div
              className={`flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:ring-2 focus-within:bg-white transition-all duration-300 hover:bg-gray-100 hover:border-pink-300 group
              ${
                emailError && emailTouched
                  ? "border-red-500 focus-within:ring-red-400"
                  : "border-gray-300 focus-within:ring-pink-400"
              }
            `}
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
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6 group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
              Password
            </label>
            <div
              className={`flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:ring-2 focus-within:bg-white transition-all duration-300 hover:bg-gray-100 hover:border-pink-300 group
              ${
                passwordError && passwordTouched
                  ? "border-red-500 focus-within:ring-red-400"
                  : "border-gray-300 focus-within:ring-pink-400"
              }
            `}
            >
              <Lock className="w-5 h-5 text-gray-400 mr-3 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
            {passwordError && passwordTouched && (
              <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 transform
              ${
                isFormValid
                  ? "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-pink-200"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isFormValid ? "Sign In" : "Please fill all fields"}
          </button>

          {/* Signup Link */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a
              href="/Signup"
              className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300 hover:underline"
            >
              Sign up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
