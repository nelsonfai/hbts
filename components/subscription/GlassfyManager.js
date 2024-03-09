
import { Glassfy } from "react-native-glassfy-module";

// Initialize Glassfy SDK
const apiKey = '3410b08907ce4772a2825f1a71b3c0c0'
export const initializeGlassfy = async () => {
  try {
    await Glassfy.initialize(apiKey, false);
  } catch (error) {
    console.error("Error initializing Glassfy:", error);
    throw error; // Rethrow the error for handling in the caller
  }
};

// Fetch all offerings
export const fetchOfferings = async () => {
  try {
    const offerings = await Glassfy.offerings().all;
    return offerings;
  } catch (error) {
    console.error("Error fetching offerings:", error);
    throw error; // Rethrow the error for handling in the caller
  }
};

// Fetch a specific SKU by ID
export const fetchSkuById = async (skuId) => {
  try {
    const sku = await Glassfy.skuWithId(skuId);
    return sku;
  } catch (error) {
    console.error("Error fetching SKU:", error);
    throw error; // Rethrow the error for handling in the caller
  }
};
