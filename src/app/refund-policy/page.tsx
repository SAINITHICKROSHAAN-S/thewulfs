// src/app/refund-policy/page.tsx

"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RefreshCw, Calendar, Package, XCircle } from 'lucide-react';

export default function RefundPolicyPage() {
    return (
        <>
            <Header />
            <div className="bg-black text-white pt-24 pb-16 font-sans min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-10 border-b border-gray-800 pb-8">
                        <h1 className="text-6xl font-anton uppercase font-extrabold tracking-wider text-red-600">
                            Refund & Returns Policy
                        </h1>
                        <p className="text-lg text-gray-400 mt-4">
                            We stand by the quality of our drops.
                        </p>
                    </div>

                    {/* Policy Content */}
                    <div className="space-y-10 font-inter text-gray-300">
                        
                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <Calendar className="h-6 w-6 text-red-500" />
                                <span>1. Return Eligibility Window</span>
                            </h2>
                            <p>You have **14 calendar days** from the date of delivery to initiate a return for **store credit or exchange**. After 14 days, unfortunately, we can’t offer you a refund or exchange.</p>
                            <p className="text-sm text-gray-400 mt-2">To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. It must also be in the original packaging with all tags attached.</p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <RefreshCw className="h-6 w-6 text-yellow-500" />
                                <span>2. Refunds (Store Credit Only)</span>
                            </h2>
                            <p>We do not offer direct cash refunds. Once your return is received and inspected, we will notify you of the approval or rejection of your store credit. Approved returns will be processed within 5 business days, and a digital store credit code will be emailed to you.</p>
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <XCircle className="h-6 w-6 text-red-500" />
                                <span>3. Non-Returnable Items</span>
                            </h2>
                            <p>Several types of goods are exempt from being returned:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-sm">
                                <li>**Custom or Personalized Items:** Items modified or made specifically for you.</li>
                                <li>**Gift Cards or Vouchers.**</li>
                                <li>Items purchased during a final sale event or marked as "Final Drop."</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold uppercase text-white mb-4 flex items-center space-x-3">
                                <Package className="h-6 w-6 text-blue-400" />
                                <span>4. Shipping Costs</span>
                            </h2>
                            <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive store credit, the cost of return shipping will be deducted from your credit balance.</p>
                        </section>
                        
                        <div className="mt-12 text-center text-sm text-gray-500 pt-8 border-t border-gray-800">
                            <p>For return instructions, please contact us at <a href="mailto:support@thewulfs.com" className="text-red-600 hover:text-white">support@thewulfs.com</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
