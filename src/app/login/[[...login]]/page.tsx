'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoonWidget } from "@/components/MoonWidget";
import { Mail, Lock, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { useCustomSignIn } from "@/lib/auth-forms";
import toast, { Toaster } from "react-hot-toast";
import { useSignIn, useUser } from "@clerk/nextjs";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const darkBrandRed = "#b91c1c";
  const linkRed = "#dc2626";

  const router = useRouter();
  const { handleSignIn, isLoaded: isAuthLoaded } = useCustomSignIn();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { isLoaded: isUserLoaded } = useUser();

  // Only render form when Clerk is fully ready
  const isReady = isAuthLoaded && isSignInLoaded && isUserLoaded;

  const handleSocialSignIn = async (strategy: "oauth_google" | "oauth_apple") => {
    if (!isReady || !signIn) {
      toast.error("Authentication service not ready. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      console.error(`${strategy} sign-in failed:`, error);
      toast.error(`Login failed. Please ensure ${strategy.split("_")[1]} is enabled.`);
    } finally {
      setIsLoading(false);
    }
  };

  const PremiumToaster = () => (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1f2937",
          color: "#fff",
          border: `1px solid ${linkRed}`,
        },
      }}
    />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !isAuthLoaded || !signIn) return;

    setIsLoading(true);
    const { success, error } = await handleSignIn(email, password);

    if (success) {
      toast.success("Welcome back, Wulf! Redirecting to the pack...");

      // 🔑 CRITICAL FIX: Use router.push for smooth client-side navigation.
      // Removed setTimeout and window.location.href.
      router.push("/");
      
    } else {
      toast.error(error);
      setIsLoading(false); // Only reset loading state on failure
    }
    // We intentionally do NOT call setIsLoading(false) on success, 
    // as navigation will handle the unmounting/new state.
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address first to proceed with password reset.");
    } else {
      router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
    }
  };

  // 🚨 Show a full-screen loader until Clerk is fully ready
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PremiumToaster />
      <div className="relative min-h-screen bg-black flex items-center justify-center p-3 font-sans text-white">
        <div className="absolute inset-0">
          <MoonWidget isVisible={true} />
        </div>

        <div className="relative z-10 w-full max-w-md py-4 px-6 rounded-lg border border-gray-700 shadow-xl bg-gray-900 bg-opacity-90 backdrop-blur-sm max-h-[90vh]">
          <div className="pt-0 flex flex-col items-center mb-2">
            <Image
              src="/assets/logo.png"
              alt="The Wulfs Logo"
              width={72}
              height={72}
              className="mb-2"
            />
            <h1 className="text-4xl font-anton uppercase font-extrabold mb-1">WULFS</h1>
            <p className="text-sm text-gray-400 font-inter">Wear Your Wild</p>
          </div>

          <form className="space-y-6 mt-0" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-red-600 focus:border-red-600 font-montserrat text-base"
                autoComplete="off"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-red-600 focus:border-red-600 font-montserrat text-base"
                autoComplete={showPassword ? "off" : "new-password"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-white font-montserrat text-lg font-bold py-3 uppercase transition-colors duration-300"
              style={{ backgroundColor: darkBrandRed }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Log In"}
            </Button>

            <div className="flex justify-start pt-2">
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className={`text-sm text-[${linkRed}] hover:text-white transition-colors font-montserrat no-underline`}
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-sm text-gray-500 font-inter">or continue with</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 border-gray-700 text-white bg-gray-900 hover:bg-gray-800 font-montserrat font-bold py-3 transition-colors duration-300"
              onClick={() => handleSocialSignIn("oauth_google")}
              disabled={isLoading}
            >
              <Image
                src="/assets/google-icon.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 border-gray-700 text-white bg-gray-900 hover:bg-gray-800 font-montserrat font-bold py-3 transition-colors duration-300"
              onClick={() => handleSocialSignIn("oauth_apple")}
              disabled={isLoading}
            >
              <Image
                src="/assets/apple-icon.png"
                alt="Apple"
                width={20}
                height={20}
                className="mr-2"
              />
              Apple
            </Button>
          </div>

          <div className="mt-8 text-center text-sm font-inter">
            <p className="text-gray-400">
              Don&apos;t have an account?
              <Link href="/sign-up" className={`text-[${linkRed}] no-underline ml-1`}>
                Sign up here
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