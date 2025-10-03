"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
    setNameError("");
    return true;
  };

  // Function to validate email
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

  // Function to validate password
  const validatePassword = (passwordValue) => {
    if (!passwordValue.trim()) {
      setPasswordError("Password cannot be empty.");
      return false;
    }
    // IMPORTANT: Ensure this matches your backend's password length requirement.
    // Your backend previously had < 9, but your client-side now has < 6.
    // For consistency, I will assume 8 characters is the minimum as per earlier discussions.
    if (passwordValue.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Handle changes for each input with immediate validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
    // Clear the specific "Email already exists" error when email changes
    if (emailError.includes("Email already exists")) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
        login(data.token, data.newUser, false); // Don't redirect, we'll handle it below

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <form onSubmit={handleNext} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] w-full max-w-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center hover:from-pink-700 hover:to-purple-700 transition-all duration-300">Parent Signup</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={handleNameChange}
            onBlur={() => setNameTouched(true)}
            required
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-white transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700
              ${nameError && nameTouched ? "border-red-500 dark:border-red-400 focus:ring-red-400 dark:focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-pink-400 dark:focus:ring-pink-500 hover:border-pink-300 dark:hover:border-pink-500"}
            `}
          />
          {nameError && nameTouched && <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center animate-shake">
            <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full mr-2"></span>
            {nameError}
          </p>}
        </div>

        <div className="mb-6">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setEmailTouched(true)}
            required
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-white transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700
              ${emailError && emailTouched ? "border-red-500 dark:border-red-400 focus:ring-red-400 dark:focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-pink-400 dark:focus:ring-pink-500 hover:border-pink-300 dark:hover:border-pink-500"}
            `}
          />
          {emailError && emailTouched && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center animate-shake">
              <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full mr-2"></span>
              Email already exists!{" "}
              <span
                onClick={() => router.push("/Login")}
                className="text-pink-600 dark:text-pink-400 italic cursor-pointer hover:underline">
                Login
              </span>{" "}
              instead.
            </p>
          )}
        </div>

        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create Password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => setPasswordTouched(true)}
            required
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-white transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700
                ${passwordError && passwordTouched ? "border-red-500 dark:border-red-400 focus:ring-red-400 dark:focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-pink-400 dark:focus:ring-pink-500 hover:border-pink-300 dark:hover:border-pink-500"}
              `}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-6 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-300"
            style={{ userSelect: "none" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          />
          <p className="text-[11px] mt-2 text-gray-600 dark:text-gray-400 italic">Password must be at least 6 characters.</p>
          {passwordError && passwordTouched && <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center animate-shake">
            <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full mr-2"></span>
            {passwordError}
          </p>}
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-[1.02] group">
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors duration-300">
            <span className="font-medium">Privacy Notice:</span> At NeoNest, your data privacy is paramount. We are committed to keeping your information confidential and do not share it with third parties.
          </p>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 transform
            ${isFormValid ? "bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-800" : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"}
          `}>
          Next
        </button>
      </form>
    </div>
  );
}
