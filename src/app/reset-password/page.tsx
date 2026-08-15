"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoonWidget } from "@/components/MoonWidget";
import { Mail, Lock, ShieldCheck, Loader2, Eye, EyeOff, Clock } from "lucide-react";
import { useCustomSignIn } from "@/lib/auth-forms";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useClerk } from "@clerk/nextjs"; // 🔑 ADDED: Import useClerk

export default function ResetPasswordPage() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { handlePasswordResetFinalization, handlePasswordResetRequest, isLoaded } = useCustomSignIn();
  const { signOut } = useClerk(); // 🔑 ADDED: Get signOut function

  // Load email from URL params or localStorage
  useEffect(() => {
    const paramEmail = searchParams.get("email");
    const storedEmail = localStorage.getItem("reset_email");

    if (paramEmail) {
      setEmail(paramEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("Missing email. Please restart the forgot password process.");
    }

    // Set timestamp when code was sent
    const sentTime = localStorage.getItem("reset_code_sent_time");
    if (!sentTime) {
      // If time is missing, assume the code has expired or the flow was interrupted
      setIsExpired(true);
      setTimeRemaining(0);
      setError("Please request a reset code first.");
    }
  }, [searchParams]);

  // Timer countdown effect
  useEffect(() => {
    const sentTime = localStorage.getItem("reset_code_sent_time");
    if (!sentTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - parseInt(sentTime)) / 1000);
      const remaining = Math.max(600 - elapsed, 0); // 10 minutes (600 seconds)

      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code || !newPassword || !isLoaded) return;

    // Check if code expired
    if (isExpired) {
      setError("Your code has expired. Please request a new one.");
      toast.error("Your code has expired. Please request a new one.");
      return;
    }

    // Validate code format
    if (code.length !== 6 || isNaN(Number(code))) {
      setError("Please enter a valid 6-digit numeric code.");
      toast.error("Please enter a valid 6-digit numeric code.");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsResetting(true);
    setError(null);

    // Clean the code
    const cleanCode = String(code).trim();

    // Call the password reset function
    const { success, error: resetError } = await handlePasswordResetFinalization(
      cleanCode,
      newPassword
    );

    if (success) {
      // 🔑 CRITICAL FIX: Explicitly sign the user out right after the successful reset
      // This clears any lingering session/state that causes the "already logged in" message.
      if (signOut) {
        await signOut({ redirectUrl: "/login" }); // This will handle the redirect for us
        // Note: The router.push("/login") below is no longer strictly necessary if signOut works
      }
      
      toast.success("✅ Password successfully reset! Redirecting to login...");
      localStorage.removeItem("reset_email");
      localStorage.removeItem("reset_code_sent_time");
      
      // Fallback redirect in case the Clerk signOut redirect doesn't trigger immediately
      router.push("/login");

    } else {
      const errorMessage = resetError || "Password reset failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }

    setIsResetting(false);
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    const toastId = toast.loading("Requesting new code...");
    
    const { success, error } = await handlePasswordResetRequest(email);
    
    if (success) {
      // Reset timer
      localStorage.setItem("reset_code_sent_time", Date.now().toString());
      setTimeRemaining(600);
      setIsExpired(false);
      setCode(""); // Clear the code field
      toast.success("New code sent! Check your email.", { id: toastId });
    } else {
      toast.error(error || "Failed to send new code.", { id: toastId });
    }
  };

  const PremiumToaster = () => (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #dc2626",
        },
      }}
    />
  );

  return (
    <>
      <PremiumToaster />
      <div className="relative min-h-screen bg-black flex items-center justify-center p-4 font-sans text-white">
        <div className="absolute inset-0">
          <MoonWidget isVisible={true} />
        </div>

        <div className="relative z-10 w-full max-w-md p-8 rounded-lg border border-gray-700 shadow-xl bg-gray-900 bg-opacity-90 backdrop-blur-sm">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/assets/logo.png"
              alt="The Wulfs Logo"
              width={72}
              height={72}
              className="mb-4"
            />
            <h1 className="text-4xl font-anton uppercase font-extrabold mb-1">
              WULFS
            </h1>
            <p className="text-sm text-gray-400 font-inter">Wear Your Wild</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-anton uppercase mb-2">Reset Password</h2>
            {email && (
              <p className="text-sm font-inter text-gray-400">
                Code sent to <span className="text-white font-bold">{email}</span>
              </p>
            )}
            
            {/* Timer Display */}
            {!isExpired && timeRemaining > 0 && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-gray-400">
                  Code expires in: <span className="text-white font-bold">{formatTime(timeRemaining)}</span>
                </span>
              </div>
            )}

            {isExpired && (
              <div className="mt-3 p-2 border border-yellow-500 rounded bg-yellow-500 bg-opacity-10">
                <p className="text-sm text-yellow-500">
                  ⚠️ Your code has expired. Please request a new one.
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm font-inter text-red-500 mt-3 p-2 border border-red-500 rounded">
                {error}
              </p>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 6-digit code input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="6-Digit Reset Code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""));
                  setError(null); // Clear error when user types
                }}
                required
                disabled={isExpired}
                className="pl-10 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-red-600 focus:border-red-600 font-montserrat text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* New password input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password (min 8 characters)"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError(null); // Clear error when user types
                }}
                required
                minLength={8}
                disabled={isExpired}
                className="pl-10 pr-10 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-red-600 focus:border-red-600 font-montserrat text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200 disabled:cursor-not-allowed"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isExpired}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-white font-montserrat text-lg font-bold py-3 uppercase transition-colors duration-300"
              style={{ backgroundColor: isExpired ? "#6b7280" : "#b91c1c" }}
              disabled={isResetting || !isLoaded || isExpired}
            >
              {isResetting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Set New Password"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors duration-200 font-inter"
              disabled={isResetting}
            >
              Didn&apos;t receive the code? <span className="font-bold">Request a new one</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm font-inter">
            <Link
              href="/forgot-password"
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              ← Back to Forgot Password
            </Link>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 flex items-center justify-center space-x-1">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Protected with advanced encryption</span>
          </div>
        </div>
      </div>
    </>
  );
}