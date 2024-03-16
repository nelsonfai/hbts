import React, { createContext, useContext, useEffect, useState } from 'react';
import { Glassfy ,GlassfySku} from 'react-native-glassfy-module';
// Define types for user state
const GlassfyContext = createContext(null);

// Glassfy provider component
export const GlassfyProvider = ({ children }) => {
  const [offerings, setOfferings] = useState([]);
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    init();
  
    }, []);

  const init = async () => {
    try {
      await Glassfy.initialize("6d9c3f88dd6b480184c2f1672bc23b4c", false);
      setIsReady(true);
      loadOfferings() 
    } catch (error) {
      //('Error initializing Glassfy:', error);
    }
  };

  const connectUser = async (consumerid) =>{
    try{
      await Glassfy.connectCustomSubscriber(consumerid);
    }
    catch (error) {
      //('Error initializing')

    }

  }
  // Function to load offerings
  const loadOfferings = async () => {
    try {
      const offerings = await Glassfy.offerings()
      const skus = offerings.all.map(offer => offer.skus).flat();   
      setOfferings(skus);
      return offerings
    } catch (error) {
      //('Error loading offerings:', error);
    }
  };

  // Function to handle purchase
  const purchase = async (sku) => {
    try {
      const transaction = await Glassfy.purchaseSku(sku);
      console.log('Transactions',transaction)
      const permission = transaction.permissions.all.find((p) => p.permissionId === "aPermission");
      console.log('IsValid',permission)
      if (permission && permission.isValid) {
        console.log('IsValid')

      }
  } catch (e) {
    //('There was an error Transaction',e)
    
  }
  };





  const getPermission = async () => {
    try {
        const permissions = await Glassfy.permissions();
        const accountableSkus = permissions.all[0].accountableSkus;
        accountableSkus.forEach(sku => {
            // Check if skuId matches a specific value
            if (sku.skuId === 'yearly_subscription_299') {
                subscriptionType = 'Yearly Plan';
            } else if (sku.skuId === 'monthly_subscription_99') {
                subscriptionType = 'Monthly Plan';
            }
        });

        // Extracting subscription status and expiration date
        let subscriptionStatus = 'No subscription';
        let expirationDate = null;
        permissions.all.forEach(permission => {
            if (permission.permissionId === 'premium') {
                subscriptionStatus = permission.isValid ? 'Active' : 'Inactive';
                if (permission.isValid) {
                    const expireDate = new Date(permission.expireDate * 1000); // Convert to milliseconds
                    expirationDate = expireDate.toISOString().split('T')[0]; // Extracting date part
                }
            }
        });

        // Check if user is on premium plan
        let isPremium = false;
        permissions.all.forEach(permission => {
            if (permission.permissionId === 'premium' && permission.isValid) {
                isPremium = true;
            }
        });

        return {
            subscriptionStatus,
            expirationDate,
            isPremium,
            subscriptionType
        };
    } catch (e) {
        //('Error fetching permissions:', e);
        return {
            subscriptionStatus: 'Error',
            expirationDate: null,
            isPremium: false,
            subscriptionType: 'Unknown'
        };
    }
};

  // Function to restore permissions
  const restorePermissions = async () => {
    try {
      var permissions = await Glassfy.restorePurchases();
      for (var p in permissions.all ?? []) {
        console.log(`${p.permissionId} is ${p.isValid}`);
    
      }
    } catch (error) {
      console.log("Failed to restore purchases $error");
    }
  };


  // Context value
  const value = {
    loadOfferings,
    purchase,
    restorePermissions,
    getPermission,
    connectUser,
    offerings
  };

  // Return empty fragment if provider is not ready
  return React.createElement(GlassfyContext.Provider, { value: value }, children);
}

// Custom hook to access Glassfy context
export const useGlassfy = () => {
  const context = useContext(GlassfyContext);
  if (!context) {
    throw new Error('useGlassfy must be used within a GlassfyProvider');
  }
  return context;
};
