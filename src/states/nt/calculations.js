import {
  NT_STAMP_DUTY_RATES,
  NT_FIRST_HOME_CONCESSION_BRACKETS,
  NT_FHOG_PROPERTY_CAP,
  NT_FHOG_LAND_CAP,
  NT_FHOG_NEW_BUILD_CAP,
  NT_LAND_TRANSFER_FEES,
  NT_FIRST_HOME_OWNERS_GRANT,
  NT_FOREIGN_BUYER_RATE,
  NT_REGIONAL_CONCESSIONS,
  NT_HOME_CONCESSION_RATES,
  NT_PENSIONER_CONCESSIONS,
  NT_SENIOR_CONCESSIONS
} from './constants.js';

// Helper function to calculate Northern Territory first home buyer concession amounts
const calculateNorthernTerritoryConcession = (price) => {
  // Find the appropriate bracket for the price
  for (const bracket of NT_FIRST_HOME_CONCESSION_BRACKETS) {
    if (price >= bracket.min && price <= bracket.max) {
      return bracket.concession;
    }
  }
  
  return 0; // Default to 0 if no bracket found
};

// Calculate NT stamp duty with first home buyer concessions
export const calculateNTStampDuty = (price, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', claimVacantLandConcession = false, propertyCategory = null, isRegional = false) => {
  // Calculate base stamp duty using NT rates
  let duty = 0;

  for (const bracket of NT_STAMP_DUTY_RATES) {
    if (price > bracket.min) {
      const taxableAmount = Math.min(price - bracket.min, bracket.max - bracket.min);
      duty += taxableAmount * bracket.rate + bracket.fixedFee;
    }
  }

  // Apply NT first home buyer concessions if eligible
  if (isFirstHomeBuyer && isPPR) {
    const concessionAmount = calculateNorthernTerritoryConcession(price);
    const discountedDuty = Math.max(0, duty - concessionAmount);
    duty = discountedDuty;
  }

  // NT has no regional concessions
  // Regional concessions are not available in NT

  return duty;
};

// Calculate NT First Home Owners Grant
export const calculateNTFirstHomeOwnersGrant = (price, propertyType, propertyCategory, estimatedBuildCost = 0, isPPR = false) => {
  // NT FHOG: $10,000 for eligible first home buyers
  if (!isPPR) {
    return 0; // Must be PPR
  }

  // Different caps based on property type
  let applicableCap;
  
  if (propertyType === 'new' || propertyType === 'off-the-plan') {
    applicableCap = NT_FHOG_NEW_BUILD_CAP;
  } else if (propertyCategory === 'land') {
    applicableCap = NT_FHOG_LAND_CAP;
  } else {
    applicableCap = NT_FHOG_PROPERTY_CAP;
  }

  // For land: total cost must be within cap
  if (propertyCategory === 'land') {
    if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
      const totalCost = price + estimatedBuildCost;
      return totalCost <= applicableCap ? NT_FIRST_HOME_OWNERS_GRANT : 0;
    }
    return 0; // No grant if no build cost provided
  }

  // For other property types: check against applicable cap
  return price <= applicableCap ? NT_FIRST_HOME_OWNERS_GRANT : 0;
};

// Calculate NT land transfer fee (tiered by property value)
export const calculateNTLandTransferFee = (price) => {
  // Find the appropriate fee tier
  const feeTiers = Object.keys(NT_LAND_TRANSFER_FEES)
    .filter(key => key !== 'INFINITY')
    .map(Number)
    .sort((a, b) => a - b);

  for (const tier of feeTiers) {
    if (price <= tier) {
      return NT_LAND_TRANSFER_FEES[tier];
    }
  }

  // If price exceeds all tiers, use the highest fee
  return NT_LAND_TRANSFER_FEES.INFINITY;
};

// Calculate NT foreign buyer duty
export const calculateNTForeignBuyerDuty = (price, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * NT_FOREIGN_BUYER_RATE;
};

// Calculate NT regional concession amount (not available in NT)
export const calculateNTRegionalConcession = (price, isRegional, baseDuty = null) => {
  // Regional concessions are not available in NT
  return 0;
};

// Calculate total NT concessions (first home buyer only)
export const calculateNTTotalConcessions = (price, isFirstHomeBuyer, isPPR, isRegional) => {
  let totalConcessions = 0;

  // First home buyer concession
  if (isFirstHomeBuyer && isPPR) {
    totalConcessions += calculateNorthernTerritoryConcession(price);
  }

  // No regional concessions in NT
  // No pensioner concessions in NT
  // No senior concessions in NT

  return totalConcessions;
};

// Calculate NT pensioner concession (not available in NT)
export const calculateNTPensionerConcession = (price, isPensioner) => {
  // Pensioner concessions are not available in NT
  return 0;
};

// Calculate NT senior concession (not available in NT)
export const calculateNTSeniorConcession = (price, isSenior) => {
  // Senior concessions are not available in NT
  return 0;
};

// Calculate comprehensive NT concessions (first home buyer only)
export const calculateNTComprehensiveConcessions = (price, isFirstHomeBuyer, isPPR, isRegional, isPensioner, isSenior) => {
  let totalConcessions = 0;

  // First home buyer concession
  if (isFirstHomeBuyer && isPPR) {
    totalConcessions += calculateNorthernTerritoryConcession(price);
  }

  // No other concessions available in NT
  // Regional concessions: not available
  // Pensioner concessions: not available
  // Senior concessions: not available

  return totalConcessions;
};
