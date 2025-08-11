import {
  ACT_STAMP_DUTY_RATES,
  ACT_FIRST_HOME_CONCESSION_BRACKETS,
  ACT_FHOG_PROPERTY_CAP,
  ACT_FHOG_LAND_CAP,
  ACT_FHOG_NEW_BUILD_CAP,
  ACT_LAND_TRANSFER_FEES,
  ACT_FIRST_HOME_OWNERS_GRANT,
  ACT_FOREIGN_BUYER_RATE,
  ACT_REGIONAL_CONCESSIONS,
  ACT_HOME_CONCESSION_RATES,
  ACT_PENSIONER_CONCESSIONS,
  ACT_SENIOR_CONCESSIONS
} from './constants.js';

// Helper function to calculate Australian Capital Territory first home buyer concession amounts
const calculateAustralianCapitalTerritoryConcession = (price) => {
  // Find the appropriate bracket for the price
  for (const bracket of ACT_FIRST_HOME_CONCESSION_BRACKETS) {
    if (price >= bracket.min && price <= bracket.max) {
      return bracket.concession;
    }
  }
  
  return 0; // Default to 0 if no bracket found
};

// Calculate ACT stamp duty with first home buyer concessions
export const calculateACTStampDuty = (price, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', claimVacantLandConcession = false, propertyCategory = null, isRegional = false) => {
  // Calculate base stamp duty using ACT rates
  let duty = 0;

  for (const bracket of ACT_STAMP_DUTY_RATES) {
    if (price > bracket.min) {
      const taxableAmount = Math.min(price - bracket.min, bracket.max - bracket.min);
      duty += taxableAmount * bracket.rate + bracket.fixedFee;
    }
  }

  // Apply ACT first home buyer concessions if eligible
  if (isFirstHomeBuyer && isPPR) {
    const concessionAmount = calculateAustralianCapitalTerritoryConcession(price);
    const discountedDuty = Math.max(0, duty - concessionAmount);
    duty = discountedDuty;
  }

  // ACT has no regional concessions
  // Regional concessions are not available in ACT

  return duty;
};

// Calculate ACT First Home Owners Grant
export const calculateACTFirstHomeOwnersGrant = (price, propertyType, propertyCategory, estimatedBuildCost = 0, isPPR = false) => {
  // ACT FHOG: $7,000 for eligible first home buyers
  if (!isPPR) {
    return 0; // Must be PPR
  }

  // Different caps based on property type
  let applicableCap;
  
  if (propertyType === 'new' || propertyType === 'off-the-plan') {
    applicableCap = ACT_FHOG_NEW_BUILD_CAP;
  } else if (propertyCategory === 'land') {
    applicableCap = ACT_FHOG_LAND_CAP;
  } else {
    applicableCap = ACT_FHOG_PROPERTY_CAP;
  }

  // For land: total cost must be within cap
  if (propertyCategory === 'land') {
    if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
      const totalCost = price + estimatedBuildCost;
      return totalCost <= applicableCap ? ACT_FIRST_HOME_OWNERS_GRANT : 0;
    }
    return 0; // No grant if no build cost provided
  }

  // For other property types: check against applicable cap
  return price <= applicableCap ? ACT_FIRST_HOME_OWNERS_GRANT : 0;
};

// Calculate ACT land transfer fee (tiered by property value)
export const calculateACTLandTransferFee = (price) => {
  // Find the appropriate fee tier
  const feeTiers = Object.keys(ACT_LAND_TRANSFER_FEES)
    .filter(key => key !== 'INFINITY')
    .map(Number)
    .sort((a, b) => a - b);

  for (const tier of feeTiers) {
    if (price <= tier) {
      return ACT_LAND_TRANSFER_FEES[tier];
    }
  }

  // If price exceeds all tiers, use the highest fee
  return ACT_LAND_TRANSFER_FEES.INFINITY;
};

// Calculate ACT foreign buyer duty
export const calculateACTForeignBuyerDuty = (price, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * ACT_FOREIGN_BUYER_RATE;
};

// Calculate ACT regional concession amount (not available in ACT)
export const calculateACTRegionalConcession = (price, isRegional, baseDuty = null) => {
  // Regional concessions are not available in ACT
  return 0;
};

// Calculate total ACT concessions (first home buyer only)
export const calculateACTTotalConcessions = (price, isFirstHomeBuyer, isPPR, isRegional) => {
  let totalConcessions = 0;

  // First home buyer concession
  if (isFirstHomeBuyer && isPPR) {
    totalConcessions += calculateAustralianCapitalTerritoryConcession(price);
  }

  // No regional concessions in ACT
  // No pensioner concessions in ACT
  // No senior concessions in ACT

  return totalConcessions;
};

// Calculate ACT pensioner concession (not available in ACT)
export const calculateACTPensionerConcession = (price, isPensioner) => {
  // Pensioner concessions are not available in ACT
  return 0;
};

// Calculate ACT senior concession (not available in ACT)
export const calculateACTSeniorConcession = (price, isSenior) => {
  // Senior concessions are not available in ACT
  return 0;
};

// Calculate comprehensive ACT concessions (first home buyer only)
export const calculateACTComprehensiveConcessions = (price, isFirstHomeBuyer, isPPR, isRegional, isPensioner, isSenior) => {
  let totalConcessions = 0;

  // First home buyer concession
  if (isFirstHomeBuyer && isPPR) {
    totalConcessions += calculateAustralianCapitalTerritoryConcession(price);
  }

  // No other concessions available in ACT
  // Regional concessions: not available
  // Pensioner concessions: not available
  // Senior concessions: not available

  return totalConcessions;
};
