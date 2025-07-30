"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import debounce from "lodash.debounce";
import { useAuth } from "../context/AuthContext";

// ✅ Added for clarity during development
console.log("Signup page loaded in the frontend");

export default function SignupPage() {
  useEffect(() => {
    document.title = "Signup | NeoNest";
  }, []);

  const router = useRouter();
  const { login } = useAuth();

  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Touch tracking
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Loading state
  const [checkingEmail, setCheckingEmail] = useState(false);

  // ===== Validation Functions =====
  const validateName = (nameValue) => {
    if (!nameValue.trim()) {
      setNameError("Name cannot be empty.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      setEmailError("Email cannot be empty.");
      return false;
    }
    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
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

  // ===== Debounced Email Check =====
  const checkEmailExists = useMemo(
    () =>
      debounce(async (emailToCheck) => {
        if (!validateEmail(emailToCheck)) return;

        try {
          setCheckingEmail(true);
          const res = await axios.post("/api/auth/check-email", { email: emailToCheck });
          if (res.data.exists) {
            setEmailError("Email already exists! Login instead.");
          } else {
            setEmailError("");
          }
        } catch (err) {
          console.error("Error checking email:", err);
          setEmailError("Could not verify email right now.");
        } finally {
          setCheckingEmail(false);
        }
      }, 500),
    []
  );

  // ===== Handlers =====
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
    setEmailError(""); // Clear before checking again
    checkEmailExists(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const isFormValid = useMemo(() => {
    const nameIsValid = validateName(name);
    const emailIsValid = validateEmail(email) && !emailError;
    const passwordIsValid = validatePassword(password);
    return nameIsValid && emailIsValid && passwordIsValid;
  }, [name, email, password, emailError]);

  const handleNext = async (e) => {
    e.preventDefault();

    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);

    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!nameValid || !emailValid || !passwordValid || emailError) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const data = res.data;

      if (res.status === 201) {
        login(data.token);
        toast.success(data.success);
        router.push(`/signupbaby`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const backendError = err.response.data.error;
        toast.error(backendError || "An unexpected error occurred.");

        if (backendError?.includes("Email already exists")) {
          setEmailError("Email already exists! Login instead.");
          setEmailTouched(true);
        }
      } else {
        toast.error("Network error or unexpected problem.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-100 to-pink-100">
      <form
        onSubmit={handleNext}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-pink-600">
          Parent Signup
        </h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={handleNameChange}
            onBlur={() => setNameTouched(true)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
              ${(nameError && nameTouched) ? 'border-red-500 focus:ring-red-400' : 'border-pink-300 focus:ring-pink-400'}
            `}
          />
          {(nameError && nameTouched) && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setEmailTouched(true)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
              ${(emailError && emailTouched) ? 'border-red-500 focus:ring-red-400' : 'border-pink-300 focus:ring-pink-400'}
            `}
          />
          {(emailError && emailTouched) && (
            <p className="text-red-500 text-sm mt-1">
              {emailError.includes("Login") ? (
                <>
                  Email already exists!{" "}
                  <span
                    onClick={() => router.push("/Login")}
                    className="text-pink-600 italic cursor-pointer hover:underline"
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

        <div className="mb-6">
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => setPasswordTouched(true)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
              ${(passwordError && passwordTouched) ? 'border-red-500 focus:ring-red-400' : 'border-pink-300 focus:ring-pink-400'}
            `}
          />
          <p className="text-[11px] mt-1 text-gray-700 italic">Password must be at least 6 characters.</p>
          {(passwordError && passwordTouched) && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        <p className="text-center text-sm text-gray-500 mb-4">
          At NeoNest, your data privacy is paramount. We are committed to
          keeping your information confidential and do not share it with third
          parties.
        </p>

        <button
          type="submit"
          disabled={!isFormValid || checkingEmail}
          className={`w-full py-2 rounded-lg font-semibold transition-transform
            ${isFormValid && !checkingEmail
              ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {checkingEmail ? "Checking..." : "Next"}
        </button>
      </form>
    </div>
  );
}
