// src/app/terms-of-service/page.tsx

"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileText, Lock, DollarSign, MessageSquare } from 'lucide-react';

export default function TermsOfServicePage() {
    return (
        <>
            <Header />
            <div className="bg-black text-white pt-24 pb-16 font-sans min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-10 border-b border-gray-800 pb-8">
                        <h1 className="text-6xl font-anton uppercase font-extrabold tracking-wider text-red-600">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-gray-400 mt-4">
                            Last Updated: October 3, 2025
                        </p>
                    </div>

                    {/* Policy Content */}
                    <div className="space-y-10 font-inter text-gray-300">
                        
                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <FileText className="h-6 w-6 text-red-500" />
                                <span>1. Acceptance of Terms</span>
                            </h2>
                            <p>By accessing or using The Wulfs website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
                            <p className="text-sm text-gray-400 mt-2">The Wulfs reserves the right to update or modify these Terms at any time without prior notice.</p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <DollarSign className="h-6 w-6 text-green-500" />
                                <span>2. Purchases and Payments</span>
                            </h2>
                            <p>All purchases made through the site are subject to our refund policy. Prices are subject to change without notice. We reserve the right to refuse any order you place with us.</p>
                            <p className="text-sm text-gray-400 mt-2">Payment is secured via **Razorpay**. By submitting payment, you represent and warrant that you are authorized to use the designated payment method.</p>
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <Lock className="h-6 w-6 text-yellow-500" />
                                <span>3. User Accounts and Conduct</span>
                            </h2>
                            <p>You agree to provide current, complete, and accurate purchase and account information for all purchases made via our Store. You are responsible for maintaining the confidentiality of your account password (managed by Clerk) and for all activities that occur under your account.</p>
                        </section>
                        
                        <div className="mt-12 text-center text-sm text-gray-500 pt-8 border-t border-gray-800">
                            <p>Need assistance? Please visit our <a href="/support" className="text-red-600 hover:text-white">Support Page</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
