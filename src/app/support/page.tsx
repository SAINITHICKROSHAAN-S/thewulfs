// src/app/support/page.tsx

"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronDown, MessageSquare, Package, DollarSign, Shield, MapPin } from 'lucide-react';

// Sample FAQ Data
const faqs = [
    {
        q: "What is the 'Shop the Drop' policy?",
        a: "Our drops are limited edition releases. Once a collection sells out, it will not be restocked. We recommend joining The Pack for early access notifications."
    },
    {
        q: "How long does shipping take?",
        a: "We currently operate in India. Standard shipping takes 5-7 business days. Priority shipping is available for major metros and takes 2-3 business days."
    },
    {
        q: "What is your return and exchange policy?",
        a: "We offer returns for store credit only within 14 days of delivery. Items must be unworn, unwashed, and have original tags attached. Custom pieces are final sale."
    },
    {
        q: "How can I track my order status?",
        a: "Once your order has shipped, you will receive an email notification containing your tracking number and a link to the carrier’s website. You can also view your order status in the 'Orders' section of your Pack Hub (Profile)."
    },
    {
        q: "Is payment information secure?",
        a: "Yes. All payments are processed through Razorpay's secure gateway, ensuring that we never store your sensitive card or UPI details. Our site uses 256-bit SSL encryption."
    },
];

// Reusable Accordion Component
const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
    <div className="border border-gray-700 rounded-xl overflow-hidden transition-all duration-300">
        <button
            className="flex justify-between items-center w-full p-5 text-lg font-bold text-gray-200 hover:bg-gray-800 transition-colors"
            onClick={onClick}
        >
            {question}
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-red-400' : ''}`} />
        </button>
        <div
            className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        >
            <div className="p-5 pt-0 text-gray-400 border-t border-gray-800">
                {answer}
            </div>
        </div>
    </div>
);


export default function SupportPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Header />
            <div className="bg-black text-white pt-24 pb-16 font-inter min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    
                    {/* Hero Section */}
                    <div className="text-center mb-16 border-b border-gray-800 pb-8">
                        <h1 className="text-6xl font-anton uppercase font-extrabold tracking-wider text-white">
                            The Pack Support
                        </h1>
                        <p className="text-lg text-gray-400 mt-4">
                            Answers to your questions regarding shipping, returns, and security.
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 text-center">
                        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:shadow-red transition-shadow cursor-pointer">
                            <Package className="h-6 w-6 mx-auto mb-2 text-red-500" />
                            <p className="text-sm font-medium text-gray-300">Track Order</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:shadow-red transition-shadow cursor-pointer">
                            <DollarSign className="h-6 w-6 mx-auto mb-2 text-red-500" />
                            <p className="text-sm font-medium text-gray-300">Refunds</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:shadow-red transition-shadow cursor-pointer">
                            <Shield className="h-6 w-6 mx-auto mb-2 text-red-500" />
                            <p className="text-sm font-medium text-gray-300">Security</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:shadow-red transition-shadow cursor-pointer">
                            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-red-500" />
                            <p className="text-sm font-medium text-gray-300">Contact Us</p>
                        </div>
                    </div>


                    {/* FAQ Accordion Section */}
                    <h2 className="text-4xl font-anton uppercase mb-8 text-white border-b border-gray-700 pb-3">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                question={faq.q}
                                answer={faq.a}
                                isOpen={openIndex === index}
                                onClick={() => toggleAccordion(index)}
                            />
                        ))}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}