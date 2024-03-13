import React, { createContext, useContext, useEffect, useState } from 'react';
import { Glassfy, GlassfyOffering, GlassfySku,GlassfyProduct } from 'react-native-glassfy-module';


// Define types for user state
const GlassfyContext = createContext(null);

// Glassfy provider component
export const GlassfyProvider = ({ children }) => {
  const [user, setUser] = useState({ /* Initial user state */ });
  const [offerings, setOfferings] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const apiKey = "6d9c3f88dd6b480184c2f1672bc23b4c"
  useEffect(() => {

    init();
  }, []);

  const init = async () => {
    try {
      await Glassfy.initialize("6d9c3f88dd6b480184c2f1672bc23b4c", false);
      setIsReady(true);
      console.log('App has been Initialized succesfully')
    } catch (error) {
      console.error('Error initializing Glassfy:', error);
    }
  };
  // Function to load offerings
  const loadOfferings = async () => {
    try {
      const offerings = await Glassfy.offerings()
      const skus = offerings.all.map(offer => offer.skus).flat();      
      setOfferings(skus);
      console.log('mY SKUs ',skus)
      return offerings
    } catch (error) {
      console.error('Error loading offerings:', error);
    }
  };

  // Function to handle purchase
  const purchase = async (sku) => {
    try {
      const transaction = await Glassfy.purchaseSku(sku);
      const permission = transaction.permissions.all.find((p) => p.permissionId === "aPermission");
      if (permission && permission.isValid) {
          // unlock aFeature
      }
  } catch (e) {
    // initialization error
  }
  };

const getPermission = async () => {
  try {
    const permissions = await Glassfy.permissions();
    let isPremium = true;  
    permissions.forEach((p)=>{
        switch (p.permissionId) {
            case "premium":
                if (p.isValid) {
                  isPremium = false;
                }
                break;
        
            default:
                break;
        }
    });
    return isPremium; 
  } catch (e) {
    return false; 
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
    getPermission,
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
