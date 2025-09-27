"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
<<<<<<< HEAD
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
=======
>>>>>>> f3190df (added neonest ai in signup forms with white borders)
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      setIsAuth(true);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

<<<<<<< HEAD
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

=======
>>>>>>> f3190df (added neonest ai in signup forms with white borders)
  const login = (token, userData, shouldRedirect = true) => {
    localStorage.setItem('token', token);
    setToken(token);
    setIsAuth(true);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
<<<<<<< HEAD
    fetchUserData(token);
    if (shouldRedirect) {
      router.push('/');
    }
=======
    if (shouldRedirect) {
      router.push('/');
    }
  };

  const updateUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
>>>>>>> f3190df (added neonest ai in signup forms with white borders)
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuth(false);
<<<<<<< HEAD
    setHasCompletedSetup(false);
  };

  const updateUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
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
=======
>>>>>>> f3190df (added neonest ai in signup forms with white borders)
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user,
      isAuth, 
      isLoading: isLoading || !isMounted, 
<<<<<<< HEAD
      hasCompletedSetup,
=======
>>>>>>> f3190df (added neonest ai in signup forms with white borders)
      login, 
      logout,
      updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
