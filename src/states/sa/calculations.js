import {
  SA_STAMP_DUTY_RATES,
  SA_FIRST_HOME_CONCESSION_BRACKETS,
  SA_FHOG_PROPERTY_CAP,
  SA_FHOG_LAND_CAP,
  SA_FHOG_NEW_BUILD_CAP,
  SA_LAND_TRANSFER_FEES,
  SA_FIRST_HOME_OWNERS_GRANT,
  SA_FOREIGN_BUYER_RATE,
  SA_OFF_THE_PLAN_CONCESSION
} from './constants.js';

// Helper function to calculate South Australia first home buyer concession amounts
const calculateSouthAustraliaConcession = (price) => {
  // Find the appropriate bracket for the price
  for (const bracket of SA_FIRST_HOME_CONCESSION_BRACKETS) {
    if (price >= bracket.min && price <= bracket.max) {
      return bracket.concession;
    }
  }
  
  return 0; // Default to 0 if no bracket found
};

// Calculate SA stamp duty with first home buyer concessions
export const calculateSAStampDuty = (price, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', claimVacantLandConcession = false, propertyCategory = null) => {
  // Calculate base stamp duty using SA rates
  let duty = 0;

  for (const bracket of SA_STAMP_DUTY_RATES) {
    if (price > bracket.min) {
      const taxableAmount = Math.min(price - bracket.min, bracket.max - bracket.min);
      duty += taxableAmount * bracket.rate + bracket.fixedFee;
    }
  }

  // Apply SA first home buyer concessions if eligible
  if (isFirstHomeBuyer && isPPR) {
    const concessionAmount = calculateSouthAustraliaConcession(price);
    const discountedDuty = Math.max(0, duty - concessionAmount);
    return discountedDuty;
  }

  // For PPR but not first home buyer: standard rates apply
  // For non-PPR (investment properties): standard rates apply
  return duty;
};

// Calculate SA First Home Owners Grant
export const calculateSAFirstHomeOwnersGrant = (price, propertyType, propertyCategory, estimatedBuildCost = 0, isPPR = false) => {
  // SA FHOG: $15,000 for eligible first home buyers
  if (!isPPR) {
    return 0; // Must be PPR
  }

  // Different caps based on property type
  let applicableCap;
  
  if (propertyType === 'new' || propertyType === 'off-the-plan') {
    applicableCap = SA_FHOG_NEW_BUILD_CAP;
  } else if (propertyCategory === 'land') {
    applicableCap = SA_FHOG_LAND_CAP;
  } else {
    applicableCap = SA_FHOG_PROPERTY_CAP;
  }

  // For land: total cost must be within cap
  if (propertyCategory === 'land') {
    if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
      const totalCost = price + estimatedBuildCost;
      return totalCost <= applicableCap ? SA_FIRST_HOME_OWNERS_GRANT : 0;
    }
    return 0; // No grant if no build cost provided
  }

  // For other property types: check against applicable cap
  return price <= applicableCap ? SA_FIRST_HOME_OWNERS_GRANT : 0;
};

// Calculate SA land transfer fee (tiered by property value)
export const calculateSALandTransferFee = (price) => {
  // Find the appropriate fee tier
  const feeTiers = Object.keys(SA_LAND_TRANSFER_FEES)
    .filter(key => key !== 'INFINITY')
    .map(Number)
    .sort((a, b) => a - b);

  for (const tier of feeTiers) {
    if (price <= tier) {
      return SA_LAND_TRANSFER_FEES[tier];
    }
  }

  // If price exceeds all tiers, use the highest fee
  return SA_LAND_TRANSFER_FEES.INFINITY;
};

// Calculate SA foreign buyer duty
export const calculateSAForeignBuyerDuty = (price, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * SA_FOREIGN_BUYER_RATE;
};

// Calculate SA off-the-plan concession (if applicable)
export const calculateSAOffThePlanConcession = (price, propertyType, constructionProgress = 0) => {
  if (propertyType !== 'off-the-plan' || !SA_OFF_THE_PLAN_CONCESSION.AVAILABLE) {
    return 0;
  }

  // SA off-the-plan concession is based on construction progress
  // This is a simplified calculation - actual implementation may vary
  if (constructionProgress >= 100) {
    return 0; // No concession if construction is complete
  }

  // Partial concession based on construction progress
  // This is a placeholder - actual SA rules may be more complex
  const baseDuty = calculateSAStampDuty(price);
  const concessionPercentage = (100 - constructionProgress) / 100;
  
  return baseDuty * concessionPercentage;
};
