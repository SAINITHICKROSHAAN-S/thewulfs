// src/app/contact/page.tsx

"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, MapPin, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const darkRed = "#b91c1c";
    const linkRed = "#dc2626";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple form validation
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        // --- Mock Form Submission Logic (No actual API call) ---
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Message sent successfully! We'll be in touch.");
            setFormData({ name: '', email: '', message: '' });
        }, 1500);
        // In a real application, you would send this data to a serverless function here.
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


    return (
        <>
            <PremiumToaster />
            <Header />
            <div className="bg-black text-white pt-24 pb-16 font-inter min-h-screen">
                <div className="container mx-auto px-4 max-w-5xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-10 border-b border-gray-800 pb-8">
                        <h1 className="text-6xl font-anton uppercase font-extrabold tracking-wider text-red-600">
                            Connect With The Pack
                        </h1>
                        <p className="text-lg text-gray-400 mt-4">
                            We are here to assist you with order inquiries, sizing, and feedback.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Contact Info Sidebar */}
                        <div className="md:col-span-1 space-y-6 p-6 bg-gray-900 border border-gray-800 rounded-xl h-fit">
                            <h2 className="text-2xl font-bold uppercase text-white border-b border-gray-700 pb-3">
                                Get In Touch
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-sm text-gray-400">General Inquiry</p>
                                        <a href="mailto:support@thewulfs.com" className="text-white font-medium hover:text-red-400">support@thewulfs.com</a>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-sm text-gray-400">Support Line</p>
                                        <a href="tel:+919876543210" className="text-white font-medium hover:text-red-400">+91 9876 543210</a>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-sm text-gray-400">Headquarters</p>
                                        <p className="text-white font-medium">Tiruchirappalli, Tamil Nadu, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2 p-6 bg-gray-900 border border-gray-800 rounded-xl">
                            <h2 className="text-2xl font-bold uppercase text-white border-b border-gray-700 pb-3 mb-6">
                                Send Us A Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input 
                                    type="text"
                                    name="name"
                                    placeholder="Your Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="h-12 bg-black border-gray-700 text-white font-montserrat"
                                />
                                <Input 
                                    type="email"
                                    name="email"
                                    placeholder="Your Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="h-12 bg-black border-gray-700 text-white font-montserrat"
                                />
                                <textarea
                                    name="message"
                                    placeholder="Your Message / Inquiry Details"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full bg-black border border-gray-700 text-white placeholder-gray-400 font-montserrat p-3 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 resize-none"
                                />

                                <Button 
                                    type="submit" 
                                    className="w-full h-12 text-white font-montserrat text-lg font-bold uppercase transition-colors duration-300 flex items-center"
                                    style={{ backgroundColor: darkRed }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MessageSquare className="mr-2 h-5 w-5" />}
                                    {isLoading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}