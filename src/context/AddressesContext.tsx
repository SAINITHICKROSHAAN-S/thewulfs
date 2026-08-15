'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressesContextType {
  addresses: Address[];
  hydrated: boolean;
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  updateAddress: (id: string, updated: Partial<Omit<Address, 'id' | 'userId'>>) => Promise<void>;
  clearAddresses: () => Promise<void>;
}

const AddressesContext = createContext<AddressesContextType | undefined>(undefined);

// Replace with actual logged-in user ID
const USER_ID = "demo-user-id";

export function AddressesProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`/api/addresses?userId=${USER_ID}`);
        if (!res.ok) throw new Error('Failed to fetch addresses');
        const data: Address[] = await res.json();
        setAddresses(data);
      } catch (e) {
        console.error("Failed to fetch addresses", e);
      } finally {
        setHydrated(true);
      }
    };
    fetchAddresses();
  }, []);

  const addAddress = async (address: Omit<Address, 'id' | 'userId'>) => {
    const newAddress: Address = { id: crypto.randomUUID(), userId: USER_ID, ...address };
    setAddresses(prev => [...prev, newAddress]);

    try {
      await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
    } catch (e) {
      console.error("Failed to add address to DB", e);
    }
  };

  const removeAddress = async (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));

    try {
      await fetch("/api/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, id }),
      });
    } catch (e) {
      console.error("Failed to remove address from DB", e);
    }
  };

  const updateAddress = async (id: string, updated: Partial<Omit<Address, 'id' | 'userId'>>) => {
    setAddresses(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));

    try {
      await fetch("/api/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, id, ...updated }),
      });
    } catch (e) {
      console.error("Failed to update address in DB", e);
    }
  };

  const clearAddresses = async () => {
    setAddresses([]);
    try {
      await fetch("/api/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID }),
      });
    } catch (e) {
      console.error("Failed to clear addresses in DB", e);
    }
  };

  return (
    <AddressesContext.Provider value={{ addresses, hydrated, addAddress, removeAddress, updateAddress, clearAddresses }}>
      {children}
    </AddressesContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressesContext);
  if (!context) throw new Error("useAddresses must be used within an AddressesProvider");
  return context;
}