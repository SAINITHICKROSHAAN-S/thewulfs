// src/app/privacy-policy/page.tsx

"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield, KeyRound, Mail, DollarSign } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <>
            <Header />
            <div className="bg-black text-white pt-24 pb-16 font-sans min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-10 border-b border-gray-800 pb-8">
                        <h1 className="text-6xl font-anton uppercase font-extrabold tracking-wider text-red-600">
                            Pack Privacy Policy
                        </h1>
                        <p className="text-lg text-gray-400 mt-4">
                            Last Updated: October 3, 2025
                        </p>
                    </div>

                    {/* Policy Content */}
                    <div className="space-y-10 font-inter text-gray-300">
                        
                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <Shield className="h-6 w-6 text-green-500" />
                                <span>1. Information We Collect</span>
                            </h2>
                            <p>We collect information necessary to process your orders, provide customer support, and improve your shopping experience. This includes:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-sm">
                                <li>**Identity Data:** Your name, email address (managed securely via Clerk), and contact preferences.</li>
                                <li>**Transaction Data:** Products purchased, date of purchase, and shipping details. **Note:** We do not store full credit card or UPI details; these are handled securely by our payment processor, Razorpay.</li>
                                <li>**Usage Data:** Information about how you use our website (e.g., pages viewed, items added to wishlist).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <KeyRound className="h-6 w-6 text-red-500" />
                                <span>2. Security & Authentication</span>
                            </h2>
                            <p>Your security is paramount. We use Clerk as our authentication provider to ensure your personal and login information is protected:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-sm">
                                <li>**Hashed Passwords:** Your password is never stored in plain text.</li>
                                <li>**Social Sign-in:** We securely link your account using tokenization (Google, Apple) and only access your verified email and name.</li>
                                <li>**Data Separation:** Clerk manages your login credentials, while your address and order history are stored separately in our secure PostgreSQL database.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <Mail className="h-6 w-6 text-yellow-500" />
                                <span>3. How We Use Your Data</span>
                            </h2>
                            <p>We use your information solely for: order fulfillment, account management (tracking addresses/orders in your Pack Hub), personalization, and communicating drops and promotions you consent to.</p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <DollarSign className="h-6 w-6 text-green-500" />
                                <span>4. Payment Processing</span>
                            </h2>
                            <p>All transactions are handled by **Razorpay**. We transmit encrypted transaction details to Razorpay for processing. At no point do we handle or store your financial information on our servers.</p>
                        </section>
                        
                        <div className="mt-12 text-center text-sm text-gray-500 pt-8 border-t border-gray-800">
                            <p>Questions? Contact us at <a href="mailto:support@thewulfs.com" className="text-red-600 hover:text-white">support@thewulfs.com</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}