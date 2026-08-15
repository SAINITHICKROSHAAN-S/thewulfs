import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";

/**
 * Custom hook to manage sign-in & password reset
 */
export function useCustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();

  // ✅ Handle email/password login
  const handleSignIn = async (email: string, password: string) => {
    if (!isLoaded || !signIn) {
      return { success: false, error: "Authentication system initializing." };
    }

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // NOTE: Session activation handled here. Redirection must be handled by the calling component.
        return { success: true, error: null }; 
      }

      return { success: false, error: "Unhandled sign-in status." };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Login failed.";
      return { success: false, error: errorMsg };
    }
  };

  // ✅ Handle password reset request
  const handlePasswordResetRequest = async (email: string) => {
    if (!isLoaded || !signIn) {
      return { success: false, error: "Authentication system initializing." };
    }

    try {
      const attempt = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      console.log("✅ Reset code sent, status:", attempt.status);

      return {
        success: true,
        status: attempt.status,
        error: null,
      };
    } catch (err: unknown) {
      console.error("❌ Failed to send reset code:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to send reset code.";
      return { success: false, error: errorMsg };
    }
  };

  // ✅ Password reset finalization (with all previous fixes)
  const handlePasswordResetFinalization = async (
    code: string,
    newPassword: string
  ) => {
    if (!isLoaded || !signIn) {
      return { success: false, error: "Authentication system initializing." };
    }

    try {
      console.log("🔄 Step 1: Attempting to verify code...");
      
      // Step 1: Verify the email code
      const verifyResult = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code,
      });

      console.log("✅ Step 1 Complete - Verification status:", verifyResult.status);

      // FIX: Check for "needs_new_password" or "complete"
      if (verifyResult.status !== "needs_new_password" && verifyResult.status !== "complete") {
        console.error("❌ Unexpected status after verification:", verifyResult.status);
        return { 
          success: false, 
          error: "Code verification failed. Please check the code and try again." 
        };
      }

      console.log("🔄 Step 2: Attempting to reset password...");

      // Step 3: Now reset the password
      const resetResult = await signIn.resetPassword({
        password: newPassword,
      });

      console.log("✅ Step 2 Complete - Reset status:", resetResult.status);

      // Step 4: Check if password reset was successful.
      if (resetResult.status === "complete") {
        // FIX: setActive is intentionally REMOVED here to force the user to log in manually.
        return { success: true, error: null };
      }

      // If we reach here, something unexpected happened
      console.error("❌ Unexpected status after password reset:", resetResult.status);
      return { 
        success: false, 
        error: `Password reset returned unexpected status: ${resetResult.status}. Please contact support.` 
      };

    } catch (err: unknown) {
      console.error("❌ Password reset error:", err);
      
      let errorMsg = "Password reset failed. Please try again.";

      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        
        console.log("🔍 Error message:", message);
        
        // Handle specific error cases
        if (message.includes("incorrect") || message.includes("invalid") || message.includes("code")) {
          errorMsg = "The code you entered is incorrect. Please check and try again.";
        } else if (message.includes("expired") || message.includes("expire")) {
          errorMsg = "Your code has expired. Please request a new one.";
        } else if (message.includes("attempts") || message.includes("too many")) {
          errorMsg = "Too many attempts. Please request a new code.";
        // FIX: Explicitly catch and display the breached password error
        } else if (message.includes("password") && (message.includes("found in an online data breach") || message.includes("breached"))) {
            errorMsg = "🚨 This password has been found in an online data breach. For account safety, please use a different, unique password.";
        } else if (message.includes("password")) {
          // Catch generic password requirement errors
          errorMsg = "Password requirements not met. Use at least 8 characters.";
        } else if (message.includes("session") || message.includes("not_allowed")) {
          errorMsg = "Session expired. Please restart from the forgot password page.";
        } else {
          // Show the actual error for debugging
          errorMsg = `Error: ${err.message}`;
        }
      }

      return { success: false, error: errorMsg };
    }
  };

  return {
    handleSignIn,
    handlePasswordResetRequest,
    handlePasswordResetFinalization,
    isLoaded,
    signIn,
  };
}

/**
 * Custom hook to manage sign-up
 */
export function useCustomSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const handleSignUp = async (email: string, password: string) => {
    if (!isLoaded || !signUp) {
      return { success: false, error: "Authentication system initializing." };
    }

    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      return { success: true, error: null };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Sign up failed.";
      return { success: false, error: errorMsg };
    }
  };

  const handleVerification = async (
    code: string,
    sessionId: string | undefined,
    redirectUrl: string
  ) => {
    if (!signUp) return { success: false, error: "Auth system initializing." };
    if (!sessionId) return { success: false, error: "Verification session ID missing." };

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId ?? (sessionId as string),
          redirectUrl,
        });
        return { success: true, error: null };
      }
      return { success: false, error: "Verification failed." };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Invalid verification code.";
      return { success: false, error: errorMsg };
    }
  };

  return { handleSignUp, handleVerification, isLoaded, signUp };
}

/**
 * Custom hook to manage user profile updates
 */
export function useCustomProfile() {
  const { user, isLoaded } = useUser();

  const updateName = async (firstName: string, lastName: string) => {
    if (!user || !isLoaded) return { success: false, error: "User not loaded." };
    try {
      await user.update({ firstName, lastName });
      return { success: true, error: null };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update name.";
      return { success: false, error: errorMsg };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !isLoaded) return { success: false, error: "User not loaded." };
    if (!user.passwordEnabled)
      return { success: false, error: "Password change disabled for social accounts." };

    try {
      await user.updatePassword({ currentPassword, newPassword });
      return { success: true, error: null };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Password update failed.";
      return { success: false, error: errorMsg };
    }
  };

  return { user: user as UserResource | null, updateName, updatePassword, isLoaded };
}