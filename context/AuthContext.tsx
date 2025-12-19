import { AuthContextType, User } from '@/types';
import { generateId, validateEmail, validatePassword } from '@/utils/helpers';
import { storage, StorageKeys } from '@/utils/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function loadCurrentUser() {
    try {
      const currentUser = await storage.get<User>(StorageKeys.CURRENT_USER);
      setUser(currentUser);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const users = await storage.get<User[]>(StorageKeys.USERS) || [];
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        await storage.set(StorageKeys.CURRENT_USER, foundUser);
        setUser(foundUser);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async function register(email: string, password: string, username: string): Promise<boolean> {
    if (!validateEmail(email) || !validatePassword(password)) {
      return false;
    }

    try {
      const users = await storage.get<User[]>(StorageKeys.USERS) || [];
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        return false;
      }

      const newUser: User = {
        id: generateId(),
        email: email.toLowerCase(),
        username,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await storage.set(StorageKeys.USERS, users);
      await storage.set(StorageKeys.CURRENT_USER, newUser);
      setUser(newUser);
      return true;
    } catch {
      return false;
    }
  }

  async function logout(): Promise<void> {
    await storage.remove(StorageKeys.CURRENT_USER);
    setUser(null);
  }

  async function updateProfile(
    updates: Partial<Pick<User, 'email' | 'username' | 'password'>>
  ): Promise<boolean> {
    if (!user) return false;

    if (updates.email && !validateEmail(updates.email)) {
      return false;
    }

    if (updates.password && !validatePassword(updates.password)) {
      return false;
    }

    try {
      const users = await storage.get<User[]>(StorageKeys.USERS) || [];

      if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
        const emailExists = users.some(
          (u) => u.id !== user.id && u.email.toLowerCase() === updates.email!.toLowerCase()
        );
        if (emailExists) return false;
      }

      const updatedUser: User = {
        ...user,
        ...updates,
        email: updates.email ? updates.email.toLowerCase() : user.email,
      };

      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
      await storage.set(StorageKeys.USERS, updatedUsers);
      await storage.set(StorageKeys.CURRENT_USER, updatedUser);
      setUser(updatedUser);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
