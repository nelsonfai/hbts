import React, { createContext, useContext, useEffect, useState } from 'react';
import { Glassfy, GlassfyOffering, GlassfySku } from 'react-native-glassfy-module';

// Define types for user state
const GlassfyContext = createContext(null);

// Glassfy provider component
export const GlassfyProvider = ({ children }) => {
  const [user, setUser] = useState({ /* Initial user state */ });
  const [offerings, setOfferings] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const apiKey = "6d9c3f88dd6b480184c2f1672bc23b4c"
  useEffect(() => {
    const init = async () => {
      try {
        await Glassfy.initialize(apiKey, false);
        setIsReady(true);
        await loadOfferings();
        // Load other data as needed
      } catch (error) {
        console.error('Error initializing Glassfy:', error);
      }
    };
    init();
  }, []);

  // Function to load offerings
  const loadOfferings = async () => {
    try {
      const loadedOfferings = await Glassfy.offerings().all;
      setOfferings(loadedOfferings);
    } catch (error) {
      console.error('Error loading offerings:', error);
    }
  };

  // Function to handle purchase
  const purchase = async (sku) => {
    try {
      // Handle purchase logic
    } catch (error) {
      console.error('Error purchasing:', error);
    }
  };

  // Function to restore permissions
  const restorePermissions = async () => {
    try {
      // Handle permissions restoration logic
    } catch (error) {
      console.error('Error restoring permissions:', error);
    }
  };

  // Context value
  const value = {
    loadOfferings,
    purchase,
    restorePermissions,
    user,
    offerings
  };

  // Return empty fragment if provider is not ready
  if (!isReady) return React.createElement(React.Fragment, null);

  return React.createElement(GlassfyContext.Provider, { value: value }, children);
};

// Custom hook to access Glassfy context
export const useGlassfy = () => {
  const context = useContext(GlassfyContext);
  if (!context) {
    throw new Error('useGlassfy must be used within a GlassfyProvider');
  }
  return context;
};
