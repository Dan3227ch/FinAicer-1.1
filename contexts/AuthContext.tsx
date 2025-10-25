import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { auth, googleProvider } from '../firebase';
// Fix: Removed modular imports from 'firebase/auth' as we are now using the v8-compat API.

const API_URL = 'http://localhost:3000/api'; // Point directly to the backend server

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  // Fix: The logout function is now async and returns a Promise.
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user profile using the token
  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid or expired
        await logout();
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      await logout();
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        await fetchUserProfile(token);
      }
      setIsLoading(false);
    };
    loadUser();
  }, [token]);

  const handleAuthSuccess = async (appToken: string) => {
    localStorage.setItem('token', appToken);
    setToken(appToken);
    await fetchUserProfile(appToken);
  };
  
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Failed to login');
    const { token: appToken } = await response.json();
    await handleAuthSuccess(appToken);
  };

  const register = async (name: string, email: string, password: string) => {
     const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) throw new Error('Failed to register');
    const { token: appToken } = await response.json();
    await handleAuthSuccess(appToken);
  };
  
  const googleLogin = async () => {
    // Fix: Use the v8-compat API for signInWithPopup.
    const result = await auth.signInWithPopup(googleProvider);
    if (!result.user) throw new Error("No user returned from Google sign-in");
    const firebaseToken = await result.user.getIdToken();

    // Send Firebase token to our backend to get our own app token
    const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: firebaseToken }),
    });

    if (!response.ok) throw new Error('Google login failed on backend');
    const { token: appToken } = await response.json();
    await handleAuthSuccess(appToken);
  };

  const logout = async () => {
    // Fix: Use the v8-compat API for signOut and make the function async.
    await auth.signOut();
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};