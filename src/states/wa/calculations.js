import {
  WA_STAMP_DUTY_RATES,
  WA_FIRST_HOME_CONCESSION_BRACKETS,
  WA_FHOG_PROPERTY_CAP,
  WA_FHOG_LAND_CAP,
  WA_FHOG_NEW_BUILD_CAP,
  WA_LAND_TRANSFER_FEES,
  WA_FIRST_HOME_OWNERS_GRANT,
  WA_FOREIGN_BUYER_RATE,
  WA_REGIONAL_CONCESSIONS,
  WA_HOME_CONCESSION_RATES,
  WA_PENSIONER_CONCESSIONS,
  WA_SENIOR_CONCESSIONS
} from './constants.js';

// Helper function to calculate Western Australia first home buyer concession amounts
const calculateWesternAustraliaConcession = (price) => {
  // Find the appropriate bracket for the price
  for (const bracket of WA_FIRST_HOME_CONCESSION_BRACKETS) {
    if (price >= bracket.min && price <= bracket.max) {
      return bracket.concession;
    }
  }
  
  return 0; // Default to 0 if no bracket found
};

// Calculate WA stamp duty with first home buyer concessions and regional concessions
export const calculateWAStampDuty = (price, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', claimVacantLandConcession = false, propertyCategory = null, isRegional = false) => {
  // Calculate base stamp duty using WA rates
  let duty = 0;

  for (const bracket of WA_STAMP_DUTY_RATES) {
    if (price > bracket.min) {
      const taxableAmount = Math.min(price - bracket.min, bracket.max - bracket.min);
      duty += taxableAmount * bracket.rate + bracket.fixedFee;
    }
  }

  // Apply WA first home buyer concessions if eligible
  if (isFirstHomeBuyer && isPPR) {
    const concessionAmount = calculateWesternAustraliaConcession(price);
    const discountedDuty = Math.max(0, duty - concessionAmount);
    duty = discountedDuty;
  }

  // Apply WA regional concession if eligible
  if (isRegional && WA_REGIONAL_CONCESSIONS.AVAILABLE) {
    const regionalConcession = Math.min(duty, WA_REGIONAL_CONCESSIONS.CONCESSION_AMOUNT);
    duty = Math.max(0, duty - regionalConcession);
  }

  return duty;
};

// Calculate WA First Home Owners Grant
export const calculateWAFirstHomeOwnersGrant = (price, propertyType, propertyCategory, estimatedBuildCost = 0, isPPR = false) => {
  // WA FHOG: $10,000 for eligible first home buyers
  if (!isPPR) {
    return 0; // Must be PPR
  }

  // Different caps based on property type
  let applicableCap;
  
  if (propertyType === 'new' || propertyType === 'off-the-plan') {
    applicableCap = WA_FHOG_NEW_BUILD_CAP;
  } else if (propertyCategory === 'land') {
    applicableCap = WA_FHOG_LAND_CAP;
  } else {
    applicableCap = WA_FHOG_PROPERTY_CAP;
  }

  // For land: total cost must be within cap
  if (propertyCategory === 'land') {
    if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
      const totalCost = price + estimatedBuildCost;
      return totalCost <= applicableCap ? WA_FIRST_HOME_OWNERS_GRANT : 0;
    }
    return 0; // No grant if no build cost provided
  }

  // For other property types: check against applicable cap
  return price <= applicableCap ? WA_FIRST_HOME_OWNERS_GRANT : 0;
};

// Calculate WA land transfer fee (tiered by property value)
export const calculateWALandTransferFee = (price) => {
  // Find the appropriate fee tier
  const feeTiers = Object.keys(WA_LAND_TRANSFER_FEES)
    .filter(key => key !== 'INFINITY')
    .map(Number)
    .sort((a, b) => a - b);

  for (const tier of feeTiers) {
    if (price <= tier) {
      return WA_LAND_TRANSFER_FEES[tier];
    }
  }

  // If price exceeds all tiers, use the highest fee
  return WA_LAND_TRANSFER_FEES.INFINITY;
};

// Calculate WA foreign buyer duty
export const calculateWAForeignBuyerDuty = (price, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * WA_FOREIGN_BUYER_RATE;
};

// Calculate WA regional concession amount
export const calculateWARegionalConcession = (price, isRegional, baseDuty = null) => {
  if (!isRegional || !WA_REGIONAL_CONCESSIONS.AVAILABLE) {
    return 0;
  }

  // If baseDuty is provided, use it; otherwise calculate it
  const duty = baseDuty !== null ? baseDuty : calculateWAStampDuty(price);
  
  // Regional concession is capped at $5,000
  return Math.min(duty, WA_REGIONAL_CONCESSIONS.CONCESSION_AMOUNT);
};

// Calculate total WA concessions (first home buyer + regional)
export const calculateWATotalConcessions = (price, isFirstHomeBuyer, isPPR, isRegional) => {
  let totalConcessions = 0;

  // First home buyer concession
  if (isFirstHomeBuyer && isPPR) {
    totalConcessions += calculateWesternAustraliaConcession(price);
  }

  // Regional concession
  if (isRegional) {
    totalConcessions += WA_REGIONAL_CONCESSIONS.CONCESSION_AMOUNT;
  }

  return totalConcessions;
};

// Calculate WA pensioner concession
export const calculateWAPensionerConcession = (price, isPensioner) => {
  if (!isPensioner || !WA_PENSIONER_CONCESSIONS.AVAILABLE) {
    return 0;
  }
  
  // Pensioner concession is capped at $2,000
  const baseDuty = calculateWAStampDuty(price);
  return Math.min(baseDuty, WA_PENSIONER_CONCESSIONS.CONCESSION_AMOUNT);
};

// Calculate WA senior concession
export const calculateWASeniorConcession = (price, isSenior) => {
  if (!isSenior || !WA_SENIOR_CONCESSIONS.AVAILABLE) {
    return 0;
  }
  
  // Senior concession is capped at $1,500
  const baseDuty = calculateWAStampDuty(price);
  return Math.min(baseDuty, WA_SENIOR_CONCESSIONS.CONCESSION_AMOUNT);
};

// Calculate comprehensive WA concessions (all types)
export const calculateWAComprehensiveConcessions = (price, isFirstHomeBuyer, isPPR, isRegional, isPensioner, isSenior) => {
  let totalConcessions = 0;

  // First home buyer concession
  if (isFirstHomeBuyer && isPPR) {
    totalConcessions += calculateWesternAustraliaConcession(price);
  }

  // Regional concession
  if (isRegional) {
    totalConcessions += WA_REGIONAL_CONCESSIONS.CONCESSION_AMOUNT;
  }

  // Pensioner concession
  if (isPensioner) {
    totalConcessions += calculateWAPensionerConcession(price, isPensioner);
  }

  // Senior concession
  if (isSenior) {
    totalConcessions += calculateWASeniorConcession(price, isSenior);
  }

  return totalConcessions;
};
