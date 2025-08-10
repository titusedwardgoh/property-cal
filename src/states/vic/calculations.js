import {
  VIC_STAMP_DUTY_RATES,
  VIC_FIRST_HOME_BUYER_CONCESSION,
  VIC_FHOG_PROPERTY_CAP,
  VIC_FHOG_LAND_CAP,
  VIC_LAND_TRANSFER_FEE_UNIT,
  VIC_STANDARD_TRANSFER_FEE_UNITS,
  VIC_FIRST_HOME_OWNERS_GRANT,
  VIC_FOREIGN_BUYER_RATE
} from './constants.js';

// Calculate VIC stamp duty with first home buyer concessions
export const calculateVICStampDuty = (price, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', propertyCategory = null) => {
  // Calculate base stamp duty using VIC rates
  let duty = 0;
  
  for (const bracket of VIC_STAMP_DUTY_RATES) {
    if (price > bracket.min) {
      const taxableAmount = Math.min(price - bracket.min, bracket.max - bracket.min);
      duty += taxableAmount * bracket.rate + bracket.fixedFee;
    }
  }
  
  // Apply VIC first home buyer concessions if eligible
  if (isFirstHomeBuyer && isPPR) {
    const { EXEMPTION_THRESHOLD, PARTIAL_CONCESSION_THRESHOLD } = VIC_FIRST_HOME_BUYER_CONCESSION;
    
    if (price <= EXEMPTION_THRESHOLD) {
      return 0; // Full exemption
    }
    
    if (price <= PARTIAL_CONCESSION_THRESHOLD) {
      // Partial exemption: duty * (1 - (750000 - price) / 150000)
      return duty * (1 - (PARTIAL_CONCESSION_THRESHOLD - price) / 150000);
    }
  }
  
  return duty;
};

// Calculate VIC First Home Owners Grant
export const calculateVICFirstHomeOwnersGrant = (price, propertyType, propertyCategory, estimatedBuildCost = 0, isPPR = false) => {
  // VIC FHOG: $10,000 for new homes up to $750,000
  if (propertyType !== 'new') {
    return 0; // Only available for new properties
  }
  
  // For land: total cost must be less than $750k
  if (propertyCategory === 'land') {
    if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
      const totalCost = price + estimatedBuildCost;
      return totalCost <= VIC_FHOG_LAND_CAP ? VIC_FIRST_HOME_OWNERS_GRANT : 0;
    }
    return 0; // No grant if no build cost provided
  }
  
  // For other property types: $750k cap
  return price <= VIC_FHOG_PROPERTY_CAP ? VIC_FIRST_HOME_OWNERS_GRANT : 0;
};

// Calculate VIC land transfer fee
export const calculateVICLandTransferFee = () => {
  // VIC: Based on fee units ($16.81 per unit)
  // Standard transfer typically uses 6-8 fee units
  return VIC_STANDARD_TRANSFER_FEE_UNITS * VIC_LAND_TRANSFER_FEE_UNIT;
};

// Calculate VIC foreign buyer duty
export const calculateVICForeignBuyerDuty = (price, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * VIC_FOREIGN_BUYER_RATE;
};
