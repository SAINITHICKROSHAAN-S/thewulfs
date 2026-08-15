// src/components/profile/MyProfileForm.tsx

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; 
import { Save, User, Mail, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { useCustomProfile } from "@/lib/auth-forms"; 
import toast, { Toaster } from 'react-hot-toast';

// --- Type Definition for Modal Props (Omitted for brevity) ---
interface PasswordChangeModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    updatePassword: (current: string, newP: string) => Promise<{ success: boolean, error: string | null }>;
    userEmail: string;
    passwordEnabled: boolean;
}

// --- Password Change Modal Content (Omitted for brevity) ---
const PasswordChangeContent = ({ isOpen, onOpenChange, updatePassword, userEmail, passwordEnabled }: PasswordChangeModalProps) => {
    // ... (Modal logic remains unchanged)
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    
    const darkRed = "#b91c1c"; 

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || (passwordEnabled && !currentPassword)) return;

        setIsPasswordLoading(true);
        const { success, error } = await updatePassword(currentPassword, newPassword);
        setIsPasswordLoading(false);

        if (success) {
            toast.success("Your password has been securely updated!");
            onOpenChange(false);
            setCurrentPassword('');
            setNewPassword('');
        } else {
            toast.error(error || "An unknown error occurred.");
        }
    };

    const isSocialLogin = !passwordEnabled;

    return (
        <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700 text-white rounded-xl shadow-2xl p-6">
            <DialogHeader>
                <DialogTitle className="text-2xl font-anton uppercase text-white flex items-center space-x-2">
                    <KeyRound className="h-6 w-6 text-red-500" />
                    <span>Change Your Password</span>
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400 mt-2 font-inter">
                    {isSocialLogin 
                        ? `You signed up using ${userEmail}, which uses Google/Apple for authentication. Password change must be done through your linked social account.`
                        : `Updating your password requires verifying your current credentials.`
                    }
                </DialogDescription>
            </DialogHeader>

            {isSocialLogin ? (
                <div className="p-4 bg-gray-800 rounded-lg border border-red-900/50">
                    <p className="text-red-400 font-medium">Authentication is handled by a social provider.</p>
                </div>
            ) : (
                <form className="space-y-4 pt-4" onSubmit={handlePasswordSubmit}>
                    {/* Current Password Inputs (omitted for brevity) */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-400 block mb-2">Current Password</label>
                        <KeyRound className="absolute left-3 top-1/2 mt-2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input 
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Your Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="pl-10 pr-10 h-12 bg-gray-800 border-gray-700 text-white font-montserrat"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 mt-2 -translate-y-1/2 text-gray-500 hover:text-white"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    
                    {/* New Password Inputs (omitted for brevity) */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-400 block mb-2">New Password</label>
                        <KeyRound className="absolute left-3 top-1/2 mt-2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input 
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Your New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="pl-10 pr-10 h-12 bg-gray-800 border-gray-700 text-white font-montserrat"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 mt-2 -translate-y-1/2 text-gray-500 hover:text-white"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button 
                            type="submit" 
                            className="h-10 text-white font-montserrat text-base font-bold uppercase transition-colors duration-300 flex items-center"
                            style={{ backgroundColor: darkRed }}
                            disabled={isPasswordLoading}
                        >
                            {isPasswordLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                            Save New Password
                        </Button>
                    </DialogFooter>
                </form>
            )}
        </DialogContent>
    );
};


export default function MyProfileForm() {
    const { user, updateName, updatePassword, isLoaded } = useCustomProfile();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for the password modal

    const darkRed = "#b91c1c";
    const linkRed = "#dc2626";

    // Effect to initialize state with current user data when loaded
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName) {
            toast.error("First name and Last name are required.");
            return;
        }

        setIsLoading(true);
        const { success, error } = await updateName(firstName, lastName);

        if (success) {
            toast.success("Profile name updated successfully!");
        } else {
            toast.error(error);
        }
        setIsLoading(false);
    };
    
    const PremiumToaster = () => (
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1f2937', 
              color: '#fff',
              border: `1px solid ${linkRed}`
            }
          }
        }
        />
    );

    // Determine if the account has a password set (i.e., not exclusively social login)
    const passwordEnabled = user?.passwordEnabled || false; // Default to false if user not loaded

    if (!isLoaded) {
        return <div className="text-center py-8 text-gray-500 flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading Profile...
        </div>;
    }

    return (
        <>
            <PremiumToaster />
            
            {/* --- MODAL DEFINITION START --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                
                {/* 1. Password Change Modal Content */}
                <PasswordChangeContent 
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    updatePassword={updatePassword}
                    userEmail={user?.emailAddresses[0]?.emailAddress || 'user@example.com'}
                    passwordEnabled={passwordEnabled}
                />
                
                
                <div className="space-y-8">
                    {/* User Avatar Section - FIX APPLIED HERE */}
                    <div className="flex items-center space-x-6 pb-6 border-b border-gray-800">
                        {/* Avatar Circle: Changed bg-gray-700 to bg-red-600 and text-white */}
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-anton uppercase text-white">
                            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <h3 className="text-2xl font-bold text-gray-200 uppercase">Personal Details</h3>

                        {/* First Name and Last Name Inputs (omitted for brevity) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="text-sm font-medium text-gray-400 block mb-2">First Name</label>
                                <User className="absolute left-3 top-1/2 mt-2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input 
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="pl-10 h-12 bg-gray-800 border-gray-700 text-white font-montserrat"
                                />
                            </div>
                        
                            <div className="relative">
                                <label className="text-sm font-medium text-gray-400 block mb-2">Last Name</label>
                                <User className="absolute left-3 top-1/2 mt-2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input 
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="pl-10 h-12 bg-gray-800 border-gray-700 text-white font-montserrat"
                                />
                            </div>
                        </div>

                        {/* Email (Disabled) */}
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-400 block mb-2">Email Address (Primary)</label>
                            <Mail className="absolute left-3 top-1/2 mt-2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <Input 
                                type="email"
                                value={user?.emailAddresses[0]?.emailAddress || ''}
                                disabled
                                className="pl-10 h-12 bg-gray-700 border-gray-700 text-gray-400 font-montserrat cursor-not-allowed"
                            />
                        </div>

                        {/* Save Button */}
                        <Button 
                            type="submit" 
                            className="h-12 text-white font-montserrat text-lg font-bold py-3 uppercase transition-colors duration-300 flex items-center mt-6"
                            style={{ backgroundColor: darkRed }}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                            Save Changes
                        </Button>
                    </form>
                    
                    {/* Security Section (Start) */}
                    <div className="pt-6 border-t border-gray-800 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-200 uppercase">Security & Connections</h3>
                        
                        {/* Change Password Button (Dialog Trigger) */}
                        <DialogTrigger asChild>
                            <Button 
                                variant="outline" 
                                className="w-full h-12 border-red-700 text-red-500 bg-gray-900 hover:bg-red-900/20 font-montserrat font-bold transition-colors"
                            >
                                <KeyRound className="mr-2 h-5 w-5" /> Change Password
                            </Button>
                        </DialogTrigger>

                        <p className="text-sm text-gray-500 pt-2">
                            For social accounts, password changes must be done via Google/Apple settings.
                        </p>
                    </div>
                    {/* Security Section (End) */}
                </div>
            
            </Dialog>
            {/* --- MODAL DEFINITION END --- */}
        </>
    );
}
