'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types/user';

export function useUser(clerkUserId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!clerkUserId) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users?clerkId=${clerkUserId}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setHydrated(true);
      }
    }

    fetchUser();
  }, [clerkUserId]);

  async function updateUser(updates: Partial<User>) {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update user');
      const updated: User = await res.json();
      setUser(updated);
    } catch (err) {
      console.error(err);
    }
  }

  return { user, updateUser, hydrated };
}
