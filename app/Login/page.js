"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeClosed } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    document.title = "Login | NeoNest";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!emailValue.includes("@") || !emailValue.includes(".")) {
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
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">
          Welcome Back to NeoNest!
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div
            className={`flex items-center border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2
            ${
              emailError && emailTouched
                ? "border-red-500 focus-within:ring-red-400"
                : "border-gray-300 focus-within:ring-purple-400"
            }
          `}
          >
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => setEmailTouched(true)}
              required
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          {emailError && emailTouched && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div
            className={`relative flex items-center border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2
            ${
              passwordError && passwordTouched
                ? "border-red-500 focus-within:ring-red-400"
                : "border-gray-300 focus-within:ring-purple-400"
            }
          `}
          >
            <Lock className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => setPasswordTouched(true)}
              required
              className="w-full bg-transparent focus:outline-none"
            />
            <div onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye className="absolute transition-all duration-300 ease-in text-[#999] right-3 top-1/2 -translate-y-1/2 w-6 h-6" />
              ) : (
                <EyeClosed className="absolute transition-all duration-300 ease-in text-[#999] right-3 top-1/2 -translate-y-1/2 w-6 h-6" />
              )}
            </div>
          </div>
          {passwordError && passwordTouched && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 rounded-xl font-semibold shadow-md transition-all
            ${
              isFormValid
                ? "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Log In
        </button>

        <p className="mt-4 text-sm text-center text-gray-500">
          New to NeoNest?{" "}
          <a
            href="/Signup"
            className="text-pink-600 hover:underline font-medium"
          >
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}
