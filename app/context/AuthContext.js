"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuth(true);
      // Fetch user data to check if setup is completed
      fetchUserData(storedToken);
    }
    setIsLoading(false);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Check if user has completed baby details setup
        const isSetupComplete = userData.noOfBabies && 
                               userData.deliveryType && 
                               userData.BabyDet && 
                               userData.BabyDet.length > 0 &&
                               userData.BabyDet.every(baby => 
                                 baby.babyName && 
                                 baby.dateOfBirth && 
                                 baby.time && 
                                 baby.gender
                               );
        setHasCompletedSetup(isSetupComplete);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    setIsAuth(true);
    fetchUserData(token);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuth(false);
    setUser(null);
    setHasCompletedSetup(false);
  };

  const updateUserData = (userData) => {
    setUser(userData);
    // Re-check setup completion status
    const isSetupComplete = userData.noOfBabies && 
                           userData.deliveryType && 
                           userData.BabyDet && 
                           userData.BabyDet.length > 0 &&
                           userData.BabyDet.every(baby => 
                             baby.babyName && 
                             baby.dateOfBirth && 
                             baby.time && 
                             baby.gender
                           );
    setHasCompletedSetup(isSetupComplete);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuth, 
      isLoading: isLoading || !isMounted, 
      user,
      hasCompletedSetup,
      login, 
      logout,
      updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
