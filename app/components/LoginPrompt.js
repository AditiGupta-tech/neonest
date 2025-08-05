"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Lock, Baby, Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPrompt({ sectionName = "this section" }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch and ensure smooth mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoginClick = () => {
    setIsNavigating(true);
    router.push('/Login');
  };

  const handleSignupClick = () => {
    setIsNavigating(true);
    router.push('/Signup');
  };

  // Prevent layout shift during hydration
  if (!mounted) {
    return (
      <div className="login-prompt-container">
        <div className="w-full max-w-md">
          <div className="login-prompt-card">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-prompt-container">
      <div className="w-full max-w-md animate-fade-in">
        <div className="login-prompt-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 hover:from-pink-700 hover:to-purple-700 transition-all duration-300">
              Access Your Baby's Personalized Features
            </h2>
            
            <p className="text-gray-600 text-sm hover:text-gray-700 transition-colors duration-300">
              Please log in to access your baby's personalized {sectionName} and track their progress with our comprehensive tools.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600 group">
              <Baby className="w-4 h-4 text-pink-500 group-hover:text-pink-600 transition-colors duration-300" />
              <span className="group-hover:text-gray-700 transition-colors duration-300">Track growth and milestones</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 group">
              <Heart className="w-4 h-4 text-purple-500 group-hover:text-purple-600 transition-colors duration-300" />
              <span className="group-hover:text-gray-700 transition-colors duration-300">Store precious memories</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleLoginClick}
              disabled={isNavigating}
              className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 transform ${
                isNavigating 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-pink-200"
              }`}
            >
              {isNavigating ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
            
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleSignupClick}
                disabled={isNavigating}
                className={`text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300 hover:underline ${
                  isNavigating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(236, 72, 153, 0.5);
          }
          100% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.8);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        /* Ensure smooth transitions and prevent layout shifts */
        .login-prompt-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%);
        }
        
        .login-prompt-card {
          width: 100%;
          max-width: 28rem;
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #f3f4f6;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .login-prompt-card:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transform: scale(1.02);
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .login-prompt-container {
            padding: 0.5rem;
          }
          
          .login-prompt-card {
            padding: 1.5rem;
            margin: 0.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .login-prompt-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 