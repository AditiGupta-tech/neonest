"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "next-auth/react";

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);


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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
              <span onClick={() => router.push("/Signup")} className="text-pink-600 italic cursor-pointer hover:underline">
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setIsMicrosoftLoading(true);
    try {
      await signIn("azure-ad", { callbackUrl: "/" });
    } catch (error) {
      console.error("Microsoft sign-in error:", error);
      toast.error("Failed to sign in with Microsoft. Please try again.");
    } finally {
      setIsMicrosoftLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  dark:bg-gray-900/90  bg-pink-100  p-4">
      <ToastContainer />
      <div className="w-full max-w-md animate-fade-in ">
        <form onSubmit={handleSubmit} className="bg-white  dark:bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 hover:from-pink-700 hover:to-purple-700 transition-all duration-300">
              Welcome Back to NeoNest!
            </h2>
            <p className="text-gray-600 text-sm hover:text-gray-700 dark:text-gray-200 transition-colors duration-300">Sign in to continue your parenting journey</p>
          </div>

          {/* Email Field */}
          <div className="mb-6 group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-500 dark:text-gray-200 transition-colors duration-300">Email Address</label>
            <div
              className={`flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:ring-2 focus-within:bg-white transition-all duration-300 hover:bg-gray-100 hover:border-pink-300 group
              ${emailError && emailTouched ? "border-red-500 focus-within:ring-red-400" : "border-gray-300 focus-within:ring-pink-400"}
            `}>
              <Mail className="w-5 h-5 text-gray-400 mr-3 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setEmailTouched(true)}
                required
                className="w-full bg-white focus:outline-none text-gray-900 placeholder-gray-500 group-hover:placeholder-gray-600  dark:bg-white transition-colors duration-300"
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
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-500 dark:text-gray-200 transition-colors duration-300">Password</label>
            <div
              className={`flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:ring-2 focus-within:bg-white transition-all duration-300 hover:bg-gray-100 hover:border-pink-300 group
              ${passwordError && passwordTouched ? "border-red-500 focus-within:ring-red-400" : "border-gray-300 focus-within:ring-pink-400"}
            `}>
              <Lock className="w-5 h-5 text-gray-400 mr-3 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)}
                required
                className="w-full bg-white focus:outline-none text-gray-900  dark:bg-white placeholder-gray-500 group-hover:placeholder-gray-600 transition-colors duration-300"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-pink-500 transition-colors duration-300 hover:scale-110 transform">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
            `}>
            {isFormValid ? "Sign In" : "Please fill all fields"}
          </button>

          {/* Signup Link */}
          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-200">
            Don't have an account?{" "}
            <a href="/Signup" className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300 hover:underline">
              Sign up here
            </a>
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Third-party Authentication Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isMicrosoftLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-pink-300 dark:hover:border-pink-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleMicrosoftSignIn}
              disabled={isGoogleLoading || isMicrosoftLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-pink-300 dark:hover:border-pink-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isMicrosoftLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                  <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
              )}
              <span>Continue with Microsoft</span>
            </button>
          </div>

        </form>        
      </div>
    </div>
  );
}
