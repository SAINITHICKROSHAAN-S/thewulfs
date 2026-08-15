// src/components/CheckoutAddressSection.tsx

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, PlusCircle, Trash, CheckCircle, Edit, Save, List, X } from "lucide-react";
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

// --- Data Mapping Table (Mock data structure remains unchanged) ---
const MOCK_PIN_CODE_MAP: { [key: string]: { city: string; state: string; country: string; } } = { 
    '620001': { city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India' },
    '620002': { city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
};


export default function CheckoutAddressSection() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for the address list modal
    const [newAddress, setNewAddress] = useState<typeof initialAddressState>(initialAddressState);
    const [isAutofilling, setIsAutofilling] = useState(false);

    const darkRed = "#b91c1c";

    // --- MOCK API CALL FUNCTION (Omitted for brevity) ---
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


    // --- Pin Code Change Handler with Autofill Logic (Omitted for brevity) ---
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


    // --- Persistence Handlers (Omitted for brevity) ---
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
            const list: Address[] = JSON.parse(storedAddresses);
            setAddresses(list);
            const defaultAddr = list.find(addr => addr.isDefault) || list[0] || null;
            setSelectedAddress(defaultAddr);
            
            if (!defaultAddr && list.length === 0) {
                setIsFormVisible(true);
            }
        } else {
            setAddresses([]);
            setIsFormVisible(true); 
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
    // NOTE: Removed 'e: React.FormEvent' argument and preventDefault() call as it's now a manual submission
    const handleSaveAndSelectAddress = () => {
        
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
        
        // CRITICAL: SELECT the new/updated address
        setSelectedAddress({ ...newAddress, id: newAddress.id || Date.now().toString() }); // Fix: Ensure selected address has an ID
        setNewAddress(initialAddressState);
        setIsFormVisible(false);
        setIsSaving(false);
        setIsModalOpen(false); // Close modal if open
    };
    
    // --- RENDER BLOCK ---
    const isEditing = !!newAddress.id;
    const hasAddresses = addresses.length > 0;
    
    // Renders a single saved address block (Omitted for brevity)
    const AddressBlock = ({ addr, showButtons = false }: { addr: Address, showButtons?: boolean }) => (
        <div 
            className={`p-4 rounded-lg transition-all ${
                addr.isDefault && !selectedAddress ? 'bg-red-900/20 border-red-700' : 'bg-gray-800 border-gray-700'
            } ${selectedAddress?.id === addr.id ? 'border-2 border-red-500' : 'border'}`}
        >
            <div className="flex items-center space-x-2 mb-1">
                <MapPin className="h-4 w-4 text-red-400" />
                <span className="font-bold text-lg text-white">{addr.label || addr.street}</span>
                {addr.isDefault && (<span className="text-xs bg-red-800/50 text-red-400 px-2 py-0.5 rounded-full border border-red-700">Default</span>)}
            </div>
            <p className="text-sm text-gray-300">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
            <p className="text-xs text-gray-500 mt-1">{addr.country}</p>
            {showButtons && (
                <div className="mt-3">
                    <Button variant="outline" size="sm" onClick={() => setSelectedAddress(addr)} 
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                        disabled={selectedAddress?.id === addr.id}
                    >
                        {selectedAddress?.id === addr.id ? <CheckCircle className="h-4 w-4 mr-2" /> : 'Select'}
                    </Button>
                </div>
            )}
        </div>
    );

    // Initial state handling (Omitted for brevity)
    if (isFetching) {
        return <div className="text-center py-4 text-gray-500 flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading Address Data...
        </div>;
    }


    // --- MODAL COMPONENT (Encapsulates the Selection Logic) ---
    const AddressSelectorModal = () => (
        <DialogContent className="sm:max-w-xl bg-gray-900 border-gray-700 text-white rounded-xl shadow-2xl p-6">
            <DialogHeader>
                <DialogTitle className="text-2xl font-anton uppercase text-white flex items-center space-x-2">
                    <List className="h-6 w-6 text-red-500" />
                    <span>Select Shipping Address</span>
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400 mt-2 font-inter">
                    Choose a saved address or add a new one for this order.
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {addresses.map(addr => (
                    <div key={addr.id} onClick={() => { setSelectedAddress(addr); setIsModalOpen(false); }} className={`cursor-pointer transition-all duration-200 p-3 rounded-lg ${selectedAddress?.id === addr.id ? 'ring-2 ring-red-500 bg-red-900/20' : 'hover:bg-gray-800'}`}>
                        <AddressBlock addr={addr} />
                    </div>
                ))}
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
                <Button
                    variant="outline"
                    className="w-full h-12 border-red-700 text-red-400 hover:bg-red-900/20 font-montserrat font-bold transition-colors"
                    onClick={() => { setIsFormVisible(true); setIsModalOpen(false); setNewAddress(initialAddressState); }}
                >
                    <PlusCircle className="h-5 w-5 mr-3" /> 
                    Add New Address
                </Button>
            </div>
        </DialogContent>
    );


    // --- RENDER SCENARIOS ---

    // SCENARIO 1: No addresses are saved (Show form immediately) OR Form is explicitly visible
    if (!hasAddresses || isFormVisible) {
        return (
            <div className="space-y-4">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}> {/* Dialog Wrapper 1 */}
                    {/* The form submission MUST BE A DIV to avoid the nested form error, and button will trigger the handler */}
                    <div className="space-y-4 p-6 bg-gray-900 border border-red-800 rounded-xl">
                        <h4 className="text-xl font-bold uppercase mb-4 text-red-400">
                            {isEditing ? `Editing: ${newAddress.label}` : 'New Address (Autofill Enabled)'}
                        </h4>
                        
                        {/* Input Fields (Omitted for brevity) */}
                        <Input type="text" placeholder="Label (e.g., Home)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} className="h-10 bg-black border-gray-700 text-white font-montserrat" />
                        <Input type="text" placeholder="Street Address" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} required className="h-10 bg-black border-gray-700 text-white font-montserrat" />
                        
                        {/* Pin Code Field with Autofill Listener */}
                        <div className="relative">
                            <Input type="text" placeholder="Pin Code" value={newAddress.zip} onChange={handlePinCodeChange} required maxLength={6} className={`h-10 bg-black border-gray-700 text-white font-montserrat ${isAutofilling ? 'pl-10' : ''}`} disabled={isAutofilling} />
                             {isAutofilling && (<Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-red-400" />)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required className="h-10 bg-black border-gray-700 text-white font-montserrat" disabled={isAutofilling || newAddress.city !== ''} />
                            <Input type="text" placeholder="State/Province" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required className="h-10 bg-black border-gray-700 text-white font-montserrat" disabled={isAutofilling || newAddress.state !== ''} />
                        </div>
                        
                        <Input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} required className="h-10 bg-black border-gray-700 text-white font-montserrat" disabled={isAutofilling || newAddress.country !== ''} />
                        
                        {/* Default Checkbox (Only visible if addresses exist) */}
                        {hasAddresses && (
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="checkoutDefault" checked={newAddress.isDefault} onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-600"/>
                                <label htmlFor="checkoutDefault" className="text-sm text-gray-300">Set as default address</label>
                            </div>
                        )}
                        
                        {/* CRITICAL FIX: Changed from type="submit" to type="button" and attached handler */}
                        <Button type="button" onClick={() => handleSaveAndSelectAddress()} className="w-full h-10 text-white font-montserrat text-base font-bold uppercase transition-colors duration-300 flex items-center" style={{ backgroundColor: darkRed }} disabled={isSaving || isAutofilling}>
                            {(isSaving || isAutofilling) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                            {isEditing ? 'Update & Continue' : 'Save & Continue'}
                        </Button>
                    </div>
                </Dialog>

                <h3 className="text-2xl font-anton uppercase text-white mb-4">
                    {hasAddresses ? 'Add/Edit Shipping Address' : 'Enter Shipping Details'}
                </h3>
                
                {/* Fallback link to profile */}
                {hasAddresses && !isEditing && (
                    <p className="text-sm text-gray-400 underline cursor-pointer" onClick={() => setIsFormVisible(false)}>
                        « Back to Saved Addresses
                    </p>
                )}
            </div>
        );
    }


    // SCENARIO 2: Addresses exist (Show selected address or selector)
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}> {/* Dialog Wrapper 2 */}
            <AddressSelectorModal /> {/* Renders the modal definition */}
            
            <div className="space-y-6">
                <h3 className="text-2xl font-anton uppercase text-white border-b border-gray-700 pb-2">
                    Shipping Destination
                </h3>
                
                {/* Display Selected Default Address */}
                {selectedAddress && (
                    <div className="bg-gray-900 border border-red-800 p-4 rounded-xl shadow-lg">
                        <p className="font-bold text-red-400 mb-1 flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5" /> <span>Shipping to: {selectedAddress.label}</span>
                        </p>
                        <AddressBlock addr={selectedAddress} />
                    </div>
                )}
                
                {/* Option to Change/Add Address */}
                <h3 className="text-xl font-anton uppercase text-gray-400 pt-2">
                    {selectedAddress ? 'Change Destination' : 'Select Destination'}
                </h3>
                
                {/* Button to Open Modal for Selection */}
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full h-12 border-gray-700 text-gray-300 hover:bg-red-800/20 font-montserrat font-bold transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <List className="h-5 w-5 mr-3" /> 
                        Select From {addresses.length} Saved Addresses
                    </Button>
                </DialogTrigger>

                {/* Manual Entry/Add New Button */}
                <Button
                    variant="outline"
                    className="w-full h-12 border-gray-700 text-gray-300 hover:bg-red-800/20 font-montserrat font-bold transition-colors"
                    onClick={() => setIsFormVisible(true)}
                >
                    <PlusCircle className="h-5 w-5 mr-3" /> 
                    Enter New Address Manually
                </Button>
            </div>
        </Dialog>
    );
}