import {
  QLD_STAMP_DUTY_RATES,
  QLD_FIRST_HOME_CONCESSION_BRACKETS,
  QLD_FIRST_HOME_BUYER_CONCESSION,
  QLD_FHOG_PROPERTY_CAP,
  QLD_FHOG_LAND_CAP,
  QLD_LAND_TRANSFER_FEES,
  QLD_FIRST_HOME_OWNERS_GRANT,
  QLD_FOREIGN_BUYER_RATE,
  QLD_VACANT_LAND_CONCESSION
} from './constants.js';

// Helper function to calculate Queensland first home buyer concession amounts
const calculateQueenslandConcession = (price) => {
  // Find the appropriate bracket for the price
  for (const bracket of QLD_FIRST_HOME_CONCESSION_BRACKETS) {
    if (price >= bracket.min && price <= bracket.max) {
      return bracket.concession;
    }
  }
  
  return 0; // Default to 0 if no bracket found
};

// Calculate QLD stamp duty with first home buyer concessions and vacant land concession
export const calculateQLDStampDuty = (price, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', claimVacantLandConcession = false, propertyCategory = null) => {
  // QLD Vacant Land Concession: If claimed, stamp duty is $0 with no caps
  if (claimVacantLandConcession && propertyCategory === 'land') {
    return 0;
  }

  // Calculate base stamp duty using QLD rates
  let duty = 0;

  for (const bracket of QLD_STAMP_DUTY_RATES) {
    if (price > bracket.min) {
      const taxableAmount = Math.min(price - bracket.min, bracket.max - bracket.min);
      duty += taxableAmount * bracket.rate + bracket.fixedFee;
    }
  }

  // Apply QLD first home buyer concessions if eligible
  if (isFirstHomeBuyer && isPPR) {
    // For new/off-the-plan properties: no stamp duty
    if (propertyType === 'new' || propertyType === 'off-the-plan') {
      return 0; // Full exemption for new/off-the-plan properties
    }
    
    // For existing properties: apply first home buyer concession
    const concessionAmount = calculateQueenslandConcession(price);
    const discountedDuty = Math.max(0, duty - concessionAmount);
    return discountedDuty;
  }

  // For PPR but not first home buyer: still get home concession rates (already applied above)
  // For non-PPR (investment properties): no concessions
  return duty;
};

// Calculate QLD First Home Owners Grant
export const calculateQLDFirstHomeOwnersGrant = (price, propertyType, propertyCategory, estimatedBuildCost = 0, isPPR = false) => {
  // QLD FHOG: $30,000 for off-the-plan properties up to $750,000
  if (propertyType !== 'off-the-plan') {
    return 0; // Only available for off-the-plan properties
  }

  if (!isPPR) {
    return 0; // Must be PPR
  }

  // For land: total cost must be less than or equal to $750k
  if (propertyCategory === 'land') {
    if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
      const totalCost = price + estimatedBuildCost;
      return totalCost <= QLD_FHOG_LAND_CAP ? QLD_FIRST_HOME_OWNERS_GRANT : 0;
    }
    return 0; // No grant if no build cost provided
  }

  // For other property types: $750k cap
  return price <= QLD_FHOG_PROPERTY_CAP ? QLD_FIRST_HOME_OWNERS_GRANT : 0;
};

// Calculate QLD land transfer fee (tiered by property value)
export const calculateQLDLandTransferFee = (price) => {
  // Find the appropriate fee tier
  const feeTiers = Object.keys(QLD_LAND_TRANSFER_FEES)
    .filter(key => key !== 'INFINITY')
    .map(Number)
    .sort((a, b) => a - b);

  for (const tier of feeTiers) {
    if (price <= tier) {
      return QLD_LAND_TRANSFER_FEES[tier];
    }
  }

  // If price exceeds all tiers, use the highest fee
  return QLD_LAND_TRANSFER_FEES.INFINITY;
};

// Calculate QLD foreign buyer duty
export const calculateQLDForeignBuyerDuty = (price, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * QLD_FOREIGN_BUYER_RATE;
};
