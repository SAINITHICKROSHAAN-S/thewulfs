// src/app/sign-up/[[...sign-up]]/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoonWidget } from "@/components/MoonWidget";
import { Mail, Lock, ShieldCheck, User as UserIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { useCustomSignUp } from "@/lib/auth-forms"; 
import toast, { Toaster } from 'react-hot-toast'; 
import { useSignIn } from "@clerk/nextjs";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [code, setCode] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  
  // Define colors for consistency (same as Login page)
  const darkBrandRed = "#b91c1c"; 
  const linkRed = "#dc2626";
  
  const router = useRouter();
  const { handleSignUp, handleVerification, isLoaded, signUp } = useCustomSignUp();
  
  const { signIn } = useSignIn(); 
  
  const handleSocialSignIn = async (strategy: 'oauth_google' | 'oauth_apple') => {
    if (!signIn) return;

    setIsLoading(true);
    try {
        await signIn.authenticateWithRedirect({
            strategy: strategy, 
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/", 
        });
    } catch (error) {
        console.error(`${strategy} sign-in failed:`, error);
        toast.error(`Login failed. Please ensure ${strategy.split('_')[1]} is enabled.`);
    } finally {
        setIsLoading(false);
    }
  };

  // Sets up the premium toast notifications
  const PremiumToaster = () => (
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#1f2937', 
          color: '#fff',
          border: `1px solid ${linkRed}`
        }
      }}
    />
  );
  
  // --- Step 1: Handle Initial Form Submission (Create User & Send Code)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !isLoaded) {
        toast.error("Please fill all required fields.");
        return;
    }
    
    setIsLoading(true);
    
    const { success, error } = await handleSignUp(email, password);
    
    if (success) {
      setPendingVerification(true);
      toast.success("Verification code sent to your email.");
    } else {
      toast.error(error);
    }
    
    setIsLoading(false);
  };

  // --- Step 2: Handle Verification Code Submission
  const handleVerificationSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!code || !isLoaded) return;

      setIsLoading(true);
      const { success, error } = await handleVerification(code, signUp?.id, "/");
      
      if (success) {
          toast.success("Success! Welcome to The Wulfs Pack.");
      } else {
          toast.error(error);
      }

      setIsLoading(false);
  }

  // --- RENDER BLOCK ---
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
            <h1 className="text-4xl font-anton uppercase font-extrabold mb-1">
              WULFS
            </h1>
            <p className="text-sm text-gray-400 font-inter">
              Wear Your Wild
            </p>
          </div>

          {!pendingVerification ? (
            /* --- STEP 1: SIGN UP FORM --- */
            <form className="space-y-4 mt-0" onSubmit={handleSubmit}>
              
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input 
                  type="text"
                  placeholder="Full Name" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                  className="pl-10 h-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-red-600 focus:border-red-600 font-montserrat text-base"
                  autoComplete="name"
                />
              </div>

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
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center space-x-2 text-sm font-inter">
                <input type="checkbox" id="terms" className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-red-600" required />
                <label htmlFor="terms" className="text-gray-400">
                  I agree to the 
                  {/* CRITICAL FIX: Link Isolation - Uses standard <a> tag to open in new tab */}
                  <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline ml-1">
                    Terms & Conditions
                  </a>
                </label>
              </div>
              
              <div className="text-center font-inter text-gray-400 text-sm">
                Join the pack. Rise up through our ranks.
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-white font-montserrat text-lg font-bold py-3 uppercase transition-colors duration-300"
                style={{ backgroundColor: darkBrandRed }}
                disabled={isLoading || !isLoaded}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Create Account'}
              </Button>
            </form>
          ) : (
            /* --- STEP 2: VERIFICATION FORM --- */
            <form className="space-y-6 mt-0" onSubmit={handleVerificationSubmit}>
                <p className="text-center text-sm text-gray-300">
                    Enter the 6-digit code sent to **{email}**.
                </p>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input 
                      type="text"
                      placeholder="Verification Code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      className="pl-10 h-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-red-600 focus:focus:border-red-600 font-montserrat text-base"
                    />
                </div>
                <Button 
                    type="submit" 
                    className="w-full h-12 text-white font-montserrat text-lg font-bold py-3 uppercase transition-colors duration-300"
                    style={{ backgroundColor: darkBrandRed }}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Verify Account'}
                </Button>
            </form>
          )}

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-sm text-gray-500 font-inter">or continue with</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          <div className="flex flex-col space-y-3">
            {/* GOOGLE SOCIAL LOGIN BUTTON */}
            <Button 
                variant="outline" 
                className="w-full h-12 border-gray-700 text-white bg-gray-900 hover:bg-gray-800 font-montserrat font-bold py-3 transition-colors duration-300"
                onClick={() => handleSocialSignIn('oauth_google')} 
                disabled={!signIn || isLoading}
            >
              <Image src="/assets/google-icon.png" alt="Google" width={20} height={20} className="mr-2" />
              Google
            </Button>
            {/* APPLE SOCIAL LOGIN BUTTON */}
            <Button 
                variant="outline" 
                className="w-full h-12 border-gray-700 text-white bg-gray-900 hover:bg-gray-800 font-montserrat font-bold py-3 transition-colors duration-300"
                onClick={() => handleSocialSignIn('oauth_apple')}
                disabled={!signIn || isLoading}
            >
              <Image src="/assets/apple-icon.png" alt="Apple" width={20} height={20} className="mr-2" />
              Apple
            </Button>
          </div>

          <div className="mt-8 text-center text-sm font-inter">
            <p className="text-gray-400">
                Already have an account? 
                <Link href="/login" className={`text-[${linkRed}] no-underline ml-1`}>
                    Log in here
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