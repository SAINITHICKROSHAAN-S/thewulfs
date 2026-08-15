'use client';

import { useEffect, useState } from 'react';
import { Address } from '@/types/address';

export function useAddresses(userId?: number) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function fetchAddresses() {
      try {
        const res = await fetch(`/api/addresses?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch addresses');
        const data: Address[] = await res.json();
        setAddresses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setHydrated(true);
      }
    }

    fetchAddresses();
  }, [userId]);

  async function addAddress(address: Omit<Address, 'id' | 'userId'>) {
    if (!userId) return;
    try {
      const res = await fetch(`/api/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...address, userId }),
      });
      if (!res.ok) throw new Error('Failed to add address');
      const newAddress: Address = await res.json();
      setAddresses((prev) => [...prev, newAddress]);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateAddress(id: number, updates: Partial<Address>) {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update address');
      const updated: Address = await res.json();
      setAddresses((prev) => prev.map((addr) => (addr.id === id ? updated : addr)));
    } catch (err) {
      console.error(err);
    }
  }

  async function removeAddress(id: number) {
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete address');
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return { addresses, addAddress, updateAddress, removeAddress, hydrated };
}
