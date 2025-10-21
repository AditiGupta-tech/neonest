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
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const router = useRouter();

  const fetchMe = async (jwt) => {
    if (!jwt) return null;
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${jwt}` },
        cache: 'no-store'
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      }
    } catch (e) {
      // silently ignore
    }
    return null;
  };

  useEffect(() => {
    setIsMounted(true);
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      setIsAuth(true);
      fetchUserData(storedToken); // Fetch user data if token exists
    } else {
      setIsLoading(false);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Always try to refresh user from server using JWT
    if (storedToken) {
      fetchMe(storedToken).finally(() => setIsLoading(false));
      return;
    }
    setIsLoading(false);
  }, []);

  const fetchUserData = async (token) => {
    setIsLoading(true);
    try {
      // Use the /api/auth/me route which returns { user }
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const json = await response.json();
        const userData = json.user || json; // support either shape
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
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
      } else {
        // If endpoint returns not ok, don't immediately logout here during hydration
        // (this avoids logging out right after a successful login if an endpoint was temporarily missing)
        console.warn('fetchUserData: non-ok response', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // don't force logout on transient errors during hydration; log for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token, userData, shouldRedirect = true) => {
    localStorage.setItem('token', token);
    setToken(token);
    setIsAuth(true);
    if (userData) {
      try {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (e) {
        console.warn('Failed to persist user data locally', e);
      }
    }

    // Refresh user data from server and update local state before redirecting
    try {
      await Promise.allSettled([fetchUserData(token), fetchMe(token)]);
    } catch (e) {
      // ignore; errors handled inside those functions
    }

    if (shouldRedirect) {
      router.push('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuth(false);
    setHasCompletedSetup(false);
    router.push('/Login'); // Redirect to login on logout
  };

  const updateUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
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
      user,
      isAuth, 
      isLoading: isLoading || !isMounted, 
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
