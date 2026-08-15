// src/app/sso-callback/page.tsx

"use client";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  // This component handles the final step of the social login process 
  // (Google, Apple, etc.) and redirects the user to the final destination (the homepage '/')
  return <AuthenticateWithRedirectCallback />;
}