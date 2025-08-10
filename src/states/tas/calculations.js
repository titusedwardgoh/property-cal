import {
  TAS_STAMP_DUTY_RATES,
  TAS_FIRST_HOME_CONCESSION_BRACKETS,
  TAS_FHOG_PROPERTY_CAP,
  TAS_FHOG_LAND_CAP,
  TAS_FHOG_NEW_BUILD_CAP,
  TAS_LAND_TRANSFER_FEES,
  TAS_FIRST_HOME_OWNERS_GRANT,
  TAS_FOREIGN_BUYER_RATE,
  TAS_REGIONAL_CONCESSIONS,
  TAS_HOME_CONCESSION_RATES,
  TAS_PENSIONER_CONCESSIONS,
  TAS_SENIOR_CONCESSIONS,
  TAS_VACANT_LAND_CONCESSION,
  TAS_OFF_THE_PLAN_CONCESSION
} from './constants.js';

// Helper function to calculate Tasmania first home buyer concession amounts
const calculateTasmaniaConcession = (price) => {
  // Find the appropriate bracket for the price
  for (const bracket of TAS_FIRST_HOME_CONCESSION_BRACKETS) {
    if (price >= bracket.min && price <= bracket.max) {
      return bracket.concession;
    }
  }
  
  return 0; // Default to 0 if no bracket found
};

// Calculate TAS stamp duty with first home buyer concessions and other concessions
export const calculateTASStampDuty = (price, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', claimVacantLandConcession = false, propertyCategory = null, isRegional = false) => {
  // Calculate base stamp duty using TAS rates
  let duty = 0;

  for (const bracket of TAS_STAMP_DUTY_RATES) {
    if (price > bracket.min) {
      const taxableAmount = Math.min(price - bracket.min, bracket.max - bracket.min);
      duty += taxableAmount * bracket.rate + bracket.fixedFee;
    }
  }

  // Apply TAS first home buyer concessions if eligible
  if (isFirstHomeBuyer && isPPR) {
    const concessionAmount = calculateTasmaniaConcession(price);
    const discountedDuty = Math.max(0, duty - concessionAmount);
    duty = discountedDuty;
  }

  // Apply TAS vacant land concession if eligible
  if (claimVacantLandConcession && TAS_VACANT_LAND_CONCESSION.AVAILABLE && propertyCategory === 'land') {
    const vacantLandConcession = Math.min(duty, TAS_VACANT_LAND_CONCESSION.CONCESSION_AMOUNT);
    duty = Math.max(0, duty - vacantLandConcession);
  }

  // Apply TAS off-the-plan concession if eligible
  if (propertyType === 'off-the-plan' && TAS_OFF_THE_PLAN_CONCESSION.AVAILABLE) {
    const offThePlanConcession = Math.min(duty, TAS_OFF_THE_PLAN_CONCESSION.CONCESSION_AMOUNT);
    duty = Math.max(0, duty - offThePlanConcession);
  }

  // Apply TAS regional concession if eligible
  if (isRegional && TAS_REGIONAL_CONCESSIONS.AVAILABLE) {
    const regionalConcession = Math.min(duty, TAS_REGIONAL_CONCESSIONS.CONCESSION_AMOUNT);
    duty = Math.max(0, duty - regionalConcession);
  }

  return duty;
};

// Calculate TAS First Home Owners Grant
export const calculateTASFirstHomeOwnersGrant = (price, propertyType, propertyCategory, estimatedBuildCost = 0, isPPR = false) => {
  // TAS FHOG: $30,000 for eligible first home buyers
  if (!isPPR) {
    return 0; // Must be PPR
  }

  // Different caps based on property type
  let applicableCap;
  
  if (propertyType === 'new' || propertyType === 'off-the-plan') {
    applicableCap = TAS_FHOG_NEW_BUILD_CAP;
  } else if (propertyCategory === 'land') {
    applicableCap = TAS_FHOG_LAND_CAP;
  } else {
    applicableCap = TAS_FHOG_PROPERTY_CAP;
  }

  // For land: total cost must be within cap
  if (propertyCategory === 'land') {
    if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
      const totalCost = price + estimatedBuildCost;
      return totalCost <= applicableCap ? TAS_FIRST_HOME_OWNERS_GRANT : 0;
    }
    return 0; // No grant if no build cost provided
  }

  // For other property types: check against applicable cap
  return price <= applicableCap ? TAS_FIRST_HOME_OWNERS_GRANT : 0;
};

// Calculate TAS land transfer fee (tiered by property value)
export const calculateTASLandTransferFee = (price) => {
  // Find the appropriate fee tier
  const feeTiers = Object.keys(TAS_LAND_TRANSFER_FEES)
    .filter(key => key !== 'INFINITY')
    .map(Number)
    .sort((a, b) => a - b);

  for (const tier of feeTiers) {
    if (price <= tier) {
      return TAS_LAND_TRANSFER_FEES[tier];
    }
  }

  // If price exceeds all tiers, use the highest fee
  return TAS_LAND_TRANSFER_FEES.INFINITY;
};

// Calculate TAS foreign buyer duty
export const calculateTASForeignBuyerDuty = (price, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * TAS_FOREIGN_BUYER_RATE;
};

// Calculate TAS vacant land concession amount
export const calculateTASVacantLandConcession = (price, claimVacantLandConcession, propertyCategory) => {
  if (!claimVacantLandConcession || !TAS_VACANT_LAND_CONCESSION.AVAILABLE || propertyCategory !== 'land') {
    return 0;
  }

  const baseDuty = calculateTASStampDuty(price);
  return Math.min(baseDuty, TAS_VACANT_LAND_CONCESSION.CONCESSION_AMOUNT);
};

// Calculate TAS off-the-plan concession amount
export const calculateTASOffThePlanConcession = (price, propertyType) => {
  if (propertyType !== 'off-the-plan' || !TAS_OFF_THE_PLAN_CONCESSION.AVAILABLE) {
    return 0;
  }

  const baseDuty = calculateTASStampDuty(price);
  return Math.min(baseDuty, TAS_OFF_THE_PLAN_CONCESSION.CONCESSION_AMOUNT);
};

// Calculate TAS regional concession amount
export const calculateTASRegionalConcession = (price, isRegional, baseDuty = null) => {
  if (!isRegional || !TAS_REGIONAL_CONCESSIONS.AVAILABLE) {
    return 0;
  }

  // If baseDuty is provided, use it; otherwise calculate it
  const duty = baseDuty !== null ? baseDuty : calculateTASStampDuty(price);
  
  // Regional concession is capped at $3,000
  return Math.min(duty, TAS_REGIONAL_CONCESSIONS.CONCESSION_AMOUNT);
};

// Calculate TAS pensioner concession
export const calculateTASPensionerConcession = (price, isPensioner) => {
  if (!isPensioner || !TAS_PENSIONER_CONCESSIONS.AVAILABLE) {
    return 0;
  }
  
  // Pensioner concession is capped at $2,500
  const baseDuty = calculateTASStampDuty(price);
  return Math.min(baseDuty, TAS_PENSIONER_CONCESSIONS.CONCESSION_AMOUNT);
};

// Calculate TAS senior concession
export const calculateTASSeniorConcession = (price, isSenior) => {
  if (!isSenior || !TAS_SENIOR_CONCESSIONS.AVAILABLE) {
    return 0;
  }
  
  // Senior concession is capped at $2,000
  const baseDuty = calculateTASStampDuty(price);
  return Math.min(baseDuty, TAS_SENIOR_CONCESSIONS.CONCESSION_AMOUNT);
};

// Calculate total TAS concessions (first home buyer + regional + vacant land + off-the-plan)
export const calculateTASTotalConcessions = (price, isFirstHomeBuyer, isPPR, isRegional, claimVacantLandConcession, propertyCategory, propertyType) => {
  let totalConcessions = 0;

  // First home buyer concession
  if (isFirstHomeBuyer && isPPR) {
    totalConcessions += calculateTasmaniaConcession(price);
  }

  // Regional concession
  if (isRegional) {
    totalConcessions += TAS_REGIONAL_CONCESSIONS.CONCESSION_AMOUNT;
  }

  // Vacant land concession
  if (claimVacantLandConcession && propertyCategory === 'land') {
    totalConcessions += calculateTASVacantLandConcession(price, claimVacantLandConcession, propertyCategory);
  }

  // Off-the-plan concession
  if (propertyType === 'off-the-plan') {
    totalConcessions += calculateTASOffThePlanConcession(price, propertyType);
  }

  return totalConcessions;
};

// Calculate comprehensive TAS concessions (all types)
export const calculateTASComprehensiveConcessions = (price, isFirstHomeBuyer, isPPR, isRegional, claimVacantLandConcession, propertyCategory, propertyType, isPensioner, isSenior) => {
  let totalConcessions = 0;

  // First home buyer concession
  if (isFirstHomeBuyer && isPPR) {
    totalConcessions += calculateTasmaniaConcession(price);
  }

  // Regional concession
  if (isRegional) {
    totalConcessions += TAS_REGIONAL_CONCESSIONS.CONCESSION_AMOUNT;
  }

  // Vacant land concession
  if (claimVacantLandConcession && propertyCategory === 'land') {
    totalConcessions += calculateTASVacantLandConcession(price, claimVacantLandConcession, propertyCategory);
  }

  // Off-the-plan concession
  if (propertyType === 'off-the-plan') {
    totalConcessions += calculateTASOffThePlanConcession(price, propertyType);
  }

  // Pensioner concession
  if (isPensioner) {
    totalConcessions += calculateTASPensionerConcession(price, isPensioner);
  }

  // Senior concession
  if (isSenior) {
    totalConcessions += calculateTASSeniorConcession(price, isSenior);
  }

  return totalConcessions;
};
