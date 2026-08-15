// src/components/profile/AddressManager.tsx

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Added all necessary Lucide icons
import { MapPin, Loader2, PlusCircle, Trash, CheckCircle, Edit, Save } from "lucide-react"; 
import toast from 'react-hot-toast';

// Define Address Type (must match Prisma schema)
interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}

const initialAddressState: Address = {
    id: '', 
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    isDefault: false,
};

// Define the shape of the data we get back
type PinCodeResult = { city: string; state: string; country: string; success: boolean; };

// --- Data Mapping Table (Type assertion added for safe indexing) ---
const MOCK_PIN_CODE_MAP: { [key: string]: { city: string; state: string; country: string; } } = { 
    '620001': { city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India' },
    '620002': { city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
};


export default function AddressManager() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newAddress, setNewAddress] = useState<typeof initialAddressState>(initialAddressState);
    const [isAutofilling, setIsAutofilling] = useState(false);

    const darkRed = "#b91c1c";

    // --- MOCK API CALL FUNCTION ---
    const lookupPinCode = async (pinCode: string): Promise<PinCodeResult> => {
        setIsAutofilling(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`); 
            
            if (!response.ok) throw new Error("API failed to respond.");

            const data = await response.json();
            
            if (data && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
                const postOffice = data[0].PostOffice[0];
                
                return { city: postOffice.District, state: postOffice.State, country: 'India', success: true };
            }
            
            toast.error("Pin Code not found or invalid.");
            return { city: '', state: '', country: '', success: false };

        } catch (error) {
            toast.error("Network error during Pin Code lookup.");
            return { city: '', state: '', country: '', success: false };
        } finally {
            setIsAutofilling(false);
        }
    };


    // --- Pin Code Change Handler with Autofill Logic ---
    const handlePinCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const pinCode = e.target.value.replace(/[^0-9]/g, ''); // Keep only numbers
        setNewAddress(prev => ({ ...prev, zip: pinCode })); 

        if (pinCode.length === 6) {
            const result = await lookupPinCode(pinCode);
            if (result.success) {
                setNewAddress(prev => ({ ...prev, city: result.city, state: result.state, country: result.country }));
                toast.success("Address fields updated!");
            } else {
                 setNewAddress(prev => ({ ...prev, city: '', state: '', country: '', }));
            }
        } else if (pinCode.length < 6) {
            setNewAddress(prev => ({ ...prev, city: '', state: '', country: '', }));
        }
    };


    // --- Persistence Handlers ---
    const ADDRESS_STORAGE_KEY = 'wulfs_user_addresses';

    const saveAddressesLocally = (newAddresses: Address[]) => {
        const sortedAddresses = newAddresses.sort((a, b) => (b.isDefault as any) - (a.isDefault as any));
        localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(sortedAddresses));
        setAddresses(sortedAddresses);
    }
    
    const fetchAddresses = () => {
        setIsFetching(true);
        const storedAddresses = localStorage.getItem(ADDRESS_STORAGE_KEY);
        if (storedAddresses) {
            setAddresses(JSON.parse(storedAddresses));
        } else {
            setAddresses([]);
        }
        setIsFetching(false);
    };

    const handleSetDefault = (id: string) => {
        const updatedAddresses = addresses.map((addr: Address) => ({
            ...addr,
            isDefault: addr.id === id,
        }));
        saveAddressesLocally(updatedAddresses);
        toast.success("Default address updated.");
    };

    const handleDelete = (id: string) => {
        const updatedAddresses = addresses.filter((a: Address) => a.id !== id);
        if (addresses.find((a: Address) => a.id === id)?.isDefault && updatedAddresses.length > 0) {
            updatedAddresses[0].isDefault = true;
        }
        saveAddressesLocally(updatedAddresses);
        toast.success(`Address deleted.`);
    };

    const handleEdit = (addressToEdit: Address) => {
        setNewAddress(addressToEdit);
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    };
    // ------------------------


    useEffect(() => {
        fetchAddresses(); // Initial fetch from localStorage
    }, []);


    // --- Form Submission Logic (Updated for Edit/Create) ---
    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation check
        const { street, city, state, zip, country } = newAddress;
        if (!street || !city || !state || !zip || !country || zip.length !== 6) {
            toast.error("Please ensure all fields are filled and Pin Code is 6 digits.");
            return;
        }

        setIsSaving(true);
        
        // --- LOGIC FOR EDIT/CREATE (MOCK) ---
        if (newAddress.id) {
            // EDIT/UPDATE LOGIC (MOCK)
            const updatedList = addresses.map((addr: Address) => {
                if (addr.id === newAddress.id) {
                    return newAddress;
                }
                if (newAddress.isDefault) {
                    return { ...addr, isDefault: false };
                }
                return addr;
            });
            saveAddressesLocally(updatedList);
            toast.success(`Address updated!`);
        } else {
            // CREATE LOGIC (MOCK)
            const isFirstAddress = addresses.length === 0;
            const finalIsDefault = isFirstAddress ? true : newAddress.isDefault;

            const newAddrWithId = { 
                ...newAddress, 
                id: Date.now().toString(), // Generate unique ID
                isDefault: finalIsDefault,
            };

            const listWithoutNew = addresses.map((addr: Address) => ({ 
                ...addr, 
                isDefault: (finalIsDefault && addr.isDefault) ? false : addr.isDefault 
            }));

            const updatedList = [...listWithoutNew, newAddrWithId];
            saveAddressesLocally(updatedList);
            toast.success("New address saved!");
        }
        // --- END LOGIC ---
        
        setNewAddress(initialAddressState);
        setIsFormVisible(false);
        setIsSaving(false);
    };
    
    // --- RENDER BLOCK ---
    const isEditing = !!newAddress.id;
    
    // Helper component for the tooltip structure
    const TooltipWrapper = ({ children, text }: { children: React.ReactNode, text: string }) => (
        <div className="relative group">
            {children}
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-600 text-white text-xs rounded-lg py-1 px-2 z-50 pointer-events-none">
                {text}
            </span>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-anton uppercase mb-4 border-b border-gray-700 pb-3">
                Shipping & Billing Addresses
            </h2>

            {/* Address List Display */}
            <div className="space-y-4">
                {isFetching && (
                    <div className="text-center py-8 text-gray-500 flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading addresses...
                    </div>
                )}
                
                {!isFetching && addresses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No saved addresses found. Add one now!</p>
                )}

                {addresses.map((addr: Address) => (
                    <div key={addr.id} className="p-4 bg-gray-800 border border-gray-700 rounded-lg flex justify-between items-center transition-shadow hover:shadow-lg">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="font-bold text-lg">{addr.label}</span>
                                {addr.isDefault && (
                                    <span className="text-xs bg-red-800/50 text-red-400 px-2 py-0.5 rounded-full border border-red-700">Default</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-300">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                            <p className="text-xs text-gray-500 mt-1">{addr.country}</p>
                        </div>
                        <div className="flex space-x-2">
                            {/* --- EDIT BUTTON (Now Functional) --- */}
                            <TooltipWrapper text="Edit">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(addr)} className="text-gray-400 hover:text-white">
                                    <Edit className="h-5 w-5" />
                                </Button>
                            </TooltipWrapper>
                            
                            {/* --- DELETE BUTTON --- */}
                            <TooltipWrapper text="Delete">
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(addr.id)} className="text-red-500 hover:bg-red-900/20">
                                    <Trash className="h-5 w-5" />
                                </Button>
                            </TooltipWrapper>
                            
                            {/* --- SET DEFAULT BUTTON --- */}
                            {!addr.isDefault && (
                                <TooltipWrapper text="Set Default">
                                    <Button variant="ghost" size="icon" onClick={() => handleSetDefault(addr.id)} className="text-green-500 hover:bg-green-900/20">
                                        <CheckCircle className="h-5 w-5" />
                                    </Button>
                                </TooltipWrapper>
                            )}
                        </div>
                    </div>
                ))}
            </div>


            {/* Add New Address Toggle */}
            <Button
                variant="outline"
                className="w-full h-12 border-gray-700 text-gray-300 hover:bg-gray-800 font-montserrat font-bold transition-colors"
                onClick={() => {
                    setIsFormVisible(!isFormVisible);
                    // If hiding, reset the form state
                    if (isFormVisible) setNewAddress(initialAddressState); 
                }}
            >
                <PlusCircle className="h-5 w-5 mr-3" /> 
                {isFormVisible ? (isEditing ? `Editing ${newAddress.label}` : 'Hide Form') : 'Add New Address'}
            </Button>

            {/* Address Input Form */}
            {isFormVisible && (
                <form onSubmit={handleSaveAddress} className="space-y-4 p-6 bg-gray-800 border border-gray-700 rounded-xl">
                    <h3 className="text-xl font-bold uppercase mb-4 text-red-400">
                        {isEditing ? `Edit Address: ${newAddress.label}` : 'Add New Address'}
                    </h3>
                    
                    {/* Input Fields (Omitted for brevity) */}
                    <Input 
                        type="text" 
                        placeholder="Label (e.g., Home, Work)" 
                        value={newAddress.label} 
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="h-10 bg-gray-900 border-gray-700 text-white font-montserrat"
                    />
                    <Input 
                        type="text" 
                        placeholder="Street Address" 
                        value={newAddress.street} 
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        required
                        className="h-10 bg-gray-900 border-gray-700 text-white font-montserrat"
                    />
                    
                    {/* Zip/Pin Code Field with Autofill Listener */}
                    <div className="relative">
                        <Input 
                            type="text" 
                            placeholder="Pin Code" 
                            value={newAddress.zip} 
                            onChange={handlePinCodeChange} // <--- UPDATED HANDLER
                            required
                            maxLength={6}
                            className={`h-10 bg-gray-900 border-gray-700 text-white font-montserrat ${isAutofilling ? 'pl-10' : ''}`}
                            disabled={isAutofilling}
                        />
                         {isAutofilling && (
                            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-red-400" />
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            type="text" 
                            placeholder="City" 
                            value={newAddress.city} 
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                            className="h-10 bg-gray-900 border-gray-700 text-white font-montserrat"
                            disabled={isAutofilling} // Disable while autofilling
                        />
                        <Input 
                            type="text" 
                            placeholder="State/Province" 
                            value={newAddress.state} 
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            required
                            className="h-10 bg-gray-900 border-gray-700 text-white font-montserrat"
                            disabled={isAutofilling} // Disable while autofilling
                        />
                    </div>
                    
                    <Input 
                        type="text" 
                        placeholder="Country" 
                        value={newAddress.country} 
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        required
                        className="h-10 bg-gray-900 border-gray-700 text-white font-montserrat"
                        disabled={isAutofilling} // Disable while autofilling
                    />
                    

                    {/* Conditional Checkbox */}
                    {addresses.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                id="defaultAddress" 
                                checked={newAddress.isDefault}
                                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-600"
                            />
                            <label htmlFor="defaultAddress" className="text-sm text-gray-300">Set as default shipping address</label>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full h-10 text-white font-montserrat text-base font-bold uppercase transition-colors duration-300 flex items-center"
                        style={{ backgroundColor: darkRed }}
                        disabled={isSaving || isAutofilling}
                    >
                        {(isSaving || isAutofilling) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                        {isEditing ? 'Update Address' : 'Save Address'}
                    </Button>
                    
                    {isEditing && (
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => { setIsFormVisible(false); setNewAddress(initialAddressState); }}
                            className="w-full h-10 border-gray-700 text-gray-400 hover:bg-gray-800 font-montserrat font-bold transition-colors"
                        >
                            Cancel Edit
                        </Button>
                    )}
                </form>
            )}
        </div>
    );
}