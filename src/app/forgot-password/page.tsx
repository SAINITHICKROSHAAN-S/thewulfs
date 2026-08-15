"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoonWidget } from "@/components/MoonWidget";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";
import { useCustomSignIn } from "@/lib/auth-forms";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { handlePasswordResetRequest, isLoaded } = useCustomSignIn();

  useEffect(() => {
    if (initialEmail && initialEmail !== email) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isLoaded) return;

    setIsLoading(true);

    const { success, error } = await handlePasswordResetRequest(email);

    if (success) {
      // Store email and sent time in localStorage for the reset page
      localStorage.setItem("reset_email", email);
      localStorage.setItem("reset_code_sent_time", Date.now().toString()); // Added time stamp
      toast.success("Reset code sent! Check your email.");
      
      // Navigate to reset page with email
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } else {
      toast.error(error || "Failed to send reset code. Try again later.");
    }

    setIsLoading(false);
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
            <h2 className="text-2xl font-anton uppercase mb-2">
              Forgot Password?
            </h2>
            <p className="text-sm font-inter text-gray-400">
              Enter your email to receive a reset code.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-red-600 focus:border-red-600 font-montserrat text-lg"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-white font-montserrat text-lg font-bold py-3 uppercase transition-colors duration-300"
              style={{ backgroundColor: "#b91c1c" }}
              disabled={isLoading || !isLoaded}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm font-inter">
            <p className="text-gray-400">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-red-500 hover:underline font-medium"
              >
                Back to Login
              </Link>
            </p>
            <p className="text-gray-400 mt-1">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-red-500 hover:underline font-medium"
              >
                Create a New Account
              </Link>
            </p>
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