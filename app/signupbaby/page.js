"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Toaster, toast } from "sonner";
import {
  Baby,
  Users,
  Calendar,
  Clock,
  Scale,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function SignupBabyPage() {
  useEffect(() => {
    document.title = "Baby Details | NeoNest";
  }, []);

  const router = useRouter();
  const { token, user } = useAuth();

  // State for form inputs
  const [noOfBabies, setNoOfBabies] = useState(1);
  const [deliveryType, setDeliveryType] = useState("");
  const [babies, setBabies] = useState([
    { babyName: "", gender: "", dateOfBirth: "", time: "", Weight: "" },
  ]);

  // State for validation errors
  const [deliveryTypeError, setDeliveryTypeError] = useState("");
  const [babyErrors, setBabyErrors] = useState([{}]);

  // State to track if inputs have been "touched"
  const [deliveryTypeTouched, setDeliveryTypeTouched] = useState(false);
  const [babiesTouched, setBabiesTouched] = useState([false]);

  // Initialize babyErrors and babiesTouched arrays when noOfBabies changes
  useEffect(() => {
    setBabyErrors(
      Array.from({ length: noOfBabies }, (_, i) => babyErrors[i] || {})
    );
    setBabiesTouched(
      Array.from({ length: noOfBabies }, (_, i) => babiesTouched[i] || false)
    );
  }, [noOfBabies]);

  // --- Validation Functions ---
  const validateDeliveryType = (value) => {
    if (!value) {
      setDeliveryTypeError("Delivery type is required.");
      return false;
    }
    setDeliveryTypeError("");
    return true;
  };

  const validateBaby = (baby, index, updateErrors = true) => {
    let currentBabyErrors = {};
    let isValid = true;

    if (!baby.babyName.trim()) {
      currentBabyErrors.babyName = "Name is required.";
      isValid = false;
    }
    if (!baby.dateOfBirth) {
      currentBabyErrors.dateOfBirth = "Date of birth is required.";
      isValid = false;
    }
    if (!baby.time) {
      currentBabyErrors.time = "Time of birth is required.";
      isValid = false;
    }
    if (!baby.gender) {
      currentBabyErrors.gender = "Gender is required.";
      isValid = false;
    }

    if (updateErrors) {
      setBabyErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[index] = currentBabyErrors;
        return newErrors;
      });
    }

    return isValid;
  };

  // --- Change Handlers ---
  const handleNoOfBabiesChange = (e) => {
    const count = parseInt(e.target.value);
    setNoOfBabies(count);
    setBabies((prev) =>
      Array.from(
        { length: count },
        (_, i) =>
          prev[i] || {
            babyName: "",
            gender: "",
            dateOfBirth: "",
            time: "",
            Weight: "",
          }
      )
    );
    setBabyErrors(Array.from({ length: count }, () => ({})));
    setBabiesTouched(Array.from({ length: count }, () => false));
    setDeliveryTypeTouched(false);
  };

  const handleDeliveryTypeChange = (e) => {
    const value = e.target.value;
    setDeliveryType(value);
    if (deliveryTypeTouched) validateDeliveryType(value);
  };

  const handleBabyChange = (index, field, value) => {
    const updatedBabies = [...babies];
    updatedBabies[index][field] = value;
    setBabies(updatedBabies);
    if (babiesTouched[index]) validateBaby(updatedBabies[index], index);
  };

  // --- onBlur Handlers ---
  const handleDeliveryTypeBlur = () => setDeliveryTypeTouched(true);
  const handleBabyBlur = (index) => {
    setBabiesTouched((prev) => {
      const newTouched = [...prev];
      newTouched[index] = true;
      return newTouched;
    });
  };

  // --- Form Validity Check (for button state) ---
  const isFormValid = useMemo(() => {
    const deliveryTypeIsValid = validateDeliveryType(deliveryType);
    if (!deliveryTypeIsValid) return false;

    const allBabiesAreValid = babies.every((baby, index) =>
      validateBaby(baby, index, false)
    );

    return allBabiesAreValid;
  }, [deliveryType, babies]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setDeliveryTypeTouched(true);
    setBabiesTouched(Array.from({ length: noOfBabies }, () => true));

    const deliveryTypeIsValid = validateDeliveryType(deliveryType);
    const allBabiesAreValid = babies.every((baby, index) =>
      validateBaby(baby, index)
    );

    if (!deliveryTypeIsValid || !allBabiesAreValid) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      const payload = {
        noOfBabies: noOfBabies,
        deliveryType: deliveryType,
        BabyDet: babies,
      };

      const res = await axios.put("/api/auth/signup", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      if (res.status === 200) {
        console.log("Signup Baby Success:", data);
        toast.success(data.success);

        const parentName = data.updatedUser?.name || user?.name || "Parent";
        sessionStorage.setItem("showWelcomeToast", "true");
        sessionStorage.setItem("parentName", parentName);

        router.push(`/`);
      } else {
        toast.error(data.error || "An unexpected error occurred.");
      }
    } catch (err) {
      console.error("Signup Baby error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const backendError = err.response.data.error;
        toast.error(
          backendError || "An unexpected error occurred from server."
        );

        if (backendError.includes("Please provide all details")) {
          setDeliveryTypeError("Delivery type is required.");
          setDeliveryTypeTouched(true);
        }
        if (backendError.includes("Please provide all baby details")) {
          babies.forEach((baby, index) => validateBaby(baby, index));
          setBabiesTouched(Array.from({ length: noOfBabies }, () => true));
        }
      } else {
        toast.error("Network error or unexpected problem.");
      }
    }
  };

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
        <div className="w-full max-w-2xl animate-fade-in">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-pink-100 rounded-full hover:bg-pink-200 transition-all duration-300 hover:scale-110 hover:rotate-3">
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
                Baby Details
              </h1>
              <p className="text-gray-600 text-sm hover:text-gray-700 transition-colors duration-300">
                Tell us about your little one(s) to personalize your experience
              </p>
            </div>

            {/* General Info Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] group">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center group-hover:text-gray-900 transition-colors duration-300">
                <Users className="w-5 h-5 mr-2 text-pink-600 group-hover:text-pink-700 transition-colors duration-300" />
                General Information
              </h2>

              {/* Number of Babies */}
              <div className="mb-6 group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                  Number of babies at birth
                </label>
                <div className="relative">
                  <select
                    value={noOfBabies}
                    onChange={handleNoOfBabiesChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white appearance-none cursor-pointer hover:border-pink-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    <option value={1}>1 (Single)</option>
                    <option value={2}>2 (Twins)</option>
                    <option value={3}>3 (Triplets)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-pink-500 transition-colors duration-300" />
                </div>
              </div>

              {/* Delivery Type */}
              <div className="mb-4 group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                  Type of Delivery
                </label>
                <div className="relative">
                  <select
                    value={deliveryType}
                    onChange={handleDeliveryTypeChange}
                    onBlur={handleDeliveryTypeBlur}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 bg-white appearance-none cursor-pointer hover:bg-gray-50 transition-all duration-300
                      ${
                        deliveryTypeError && deliveryTypeTouched
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-pink-400 hover:border-pink-300"
                      }
                    `}
                  >
                    <option value="">Select Delivery Type</option>
                    <option value="Normal">Normal</option>
                    <option value="C-Section">C-Section</option>
                    <option value="Assisted">Assisted</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-pink-500 transition-colors duration-300" />
                </div>
                {deliveryTypeError && deliveryTypeTouched && (
                  <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {deliveryTypeError}
                  </p>
                )}
              </div>
            </div>

            {/* Baby Details Section */}
            <div className="space-y-6 mb-8">
              {babies.map((baby, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <h3 className="font-semibold text-purple-700 mb-4 flex items-center group-hover:text-purple-800 transition-colors duration-300">
                    <Baby className="w-5 h-5 mr-2 group-hover:text-purple-600 transition-colors duration-300" />
                    Baby {index + 1}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Baby Name */}
                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                        Baby's Name
                      </label>
                      <div
                        className={`flex items-center border rounded-xl px-3 py-3 bg-white focus-within:ring-2 transition-all duration-300 hover:bg-gray-50 hover:border-purple-300 group
                        ${
                          babyErrors[index]?.babyName && babiesTouched[index]
                            ? "border-red-500 focus-within:ring-red-400"
                            : "border-gray-300 focus-within:ring-purple-400"
                        }
                      `}
                      >
                        <Baby className="w-5 h-5 text-gray-400 mr-3 group-hover:text-purple-500 transition-colors duration-300" />
                        <input
                          type="text"
                          placeholder="Enter baby's name"
                          value={baby.babyName}
                          onChange={(e) =>
                            handleBabyChange(index, "babyName", e.target.value)
                          }
                          onBlur={() => handleBabyBlur(index)}
                          required
                          className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 group-hover:placeholder-gray-600 transition-colors duration-300"
                        />
                      </div>
                      {babyErrors[index]?.babyName && babiesTouched[index] && (
                        <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {babyErrors[index].babyName}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                        Date of Birth
                      </label>
                      <div
                        className={`flex items-center border rounded-xl px-3 py-3 bg-white focus-within:ring-2 transition-all duration-300 hover:bg-gray-50 hover:border-purple-300 group
                        ${
                          babyErrors[index]?.dateOfBirth && babiesTouched[index]
                            ? "border-red-500 focus-within:ring-red-400"
                            : "border-gray-300 focus-within:ring-purple-400"
                        }
                      `}
                      >
                        <Calendar className="w-5 h-5 text-gray-400 mr-3 group-hover:text-purple-500 transition-colors duration-300" />
                        <input
                          type="date"
                          value={baby.dateOfBirth}
                          onChange={(e) =>
                            handleBabyChange(
                              index,
                              "dateOfBirth",
                              e.target.value
                            )
                          }
                          onBlur={() => handleBabyBlur(index)}
                          required
                          className="w-full bg-transparent focus:outline-none text-gray-900"
                        />
                      </div>
                      {babyErrors[index]?.dateOfBirth &&
                        babiesTouched[index] && (
                          <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                            {babyErrors[index].dateOfBirth}
                          </p>
                        )}
                    </div>

                    {/* Time of Birth */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                        Time of Birth
                      </label>
                      <div
                        className={`flex items-center border rounded-xl px-3 py-3 bg-white focus-within:ring-2 transition-all duration-300 hover:bg-gray-50 hover:border-purple-300 group
                        ${
                          babyErrors[index]?.time && babiesTouched[index]
                            ? "border-red-500 focus-within:ring-red-400"
                            : "border-gray-300 focus-within:ring-purple-400"
                        }
                      `}
                      >
                        <Clock className="w-5 h-5 text-gray-400 mr-3 group-hover:text-purple-500 transition-colors duration-300" />
                        <input
                          type="time"
                          value={baby.time}
                          onChange={(e) =>
                            handleBabyChange(index, "time", e.target.value)
                          }
                          onBlur={() => handleBabyBlur(index)}
                          required
                          className="w-full bg-transparent focus:outline-none text-gray-900"
                        />
                      </div>
                      {babyErrors[index]?.time && babiesTouched[index] && (
                        <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {babyErrors[index].time}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          value={baby.gender}
                          onChange={(e) =>
                            handleBabyChange(index, "gender", e.target.value)
                          }
                          onBlur={() => handleBabyBlur(index)}
                          required
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 bg-white appearance-none cursor-pointer hover:bg-gray-50 transition-all duration-300
                            ${
                              babyErrors[index]?.gender && babiesTouched[index]
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-purple-400 hover:border-purple-300"
                            }
                          `}
                        >
                          <option value="">Select Gender</option>
                          <option value="Boy">Boy</option>
                          <option value="Girl">Girl</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-purple-500 transition-colors duration-300" />
                      </div>
                      {babyErrors[index]?.gender && babiesTouched[index] && (
                        <p className="text-red-500 text-sm mt-2 flex items-center animate-shake">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {babyErrors[index].gender}
                        </p>
                      )}
                    </div>

                    {/* Weight */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                        Weight at Birth (kg)
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 bg-white focus-within:ring-2 focus-within:ring-purple-400 transition-all duration-300 hover:bg-gray-50 hover:border-purple-300 group">
                        <Scale className="w-5 h-5 text-gray-400 mr-3 group-hover:text-purple-500 transition-colors duration-300" />
                        <input
                          type="number"
                          value={baby.Weight}
                          onChange={(e) =>
                            handleBabyChange(index, "Weight", e.target.value)
                          }
                          placeholder="Optional"
                          min="0"
                          step="0.1"
                          className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 group-hover:placeholder-gray-600 transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Privacy Notice */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-[1.02] group">
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
              className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 transform
                ${
                  isFormValid
                    ? "bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-purple-200"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {isFormValid
                ? "Complete Setup"
                : "Please fill all required fields"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
