import { 
  NSW_STAMP_DUTY_RATES, 
  NSW_LAND_CONCESSIONAL_RATES, 
  NSW_CONCESSIONAL_RATES,
  NSW_FHOG_PROPERTY_CAP,
  NSW_FHOG_LAND_CAP
} from './constants.js';

// NSW-specific stamp duty calculation
export const calculateNSWStampDuty = (price, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', propertyCategory = null) => {
  let duty = 0;
  
  // Return 0 if no price
  if (!price || price <= 0) {
    return 0;
  }
  
  // Standard NSW stamp duty calculation using fixed fee approach
  const rates = NSW_STAMP_DUTY_RATES;
  
  // Find the appropriate bracket and calculate duty
  for (const bracket of rates) {
    if (price <= bracket.max) {
      // Calculate: Fixed Fee + (Rate × Amount over the bracket minimum)
      const amountOverMin = price - bracket.min;
      duty = bracket.fixedFee + (amountOverMin * bracket.rate);
      break; // Use only one bracket based on total price
    }
  }
  
  // Apply NSW-specific concessions
  if (isFirstHomeBuyer && isPPR) {
    duty = applyNSWFirstHomeBuyerConcession(duty, price, propertyCategory);
  }
  
  return duty;
};

// NSW First Home Buyer Concession Logic
const applyNSWFirstHomeBuyerConcession = (duty, price, propertyCategory) => {
  // Check if this is a land property - use different rates for land between $350k-$450k
  if (propertyCategory === 'land' && price >= 350000 && price <= 450000) {
    // NSW Land-specific concessional rates for properties between $350k and $450k
    let landConcessionalRate = 0;
    
    // Find the appropriate rate for the price
    for (const [threshold, rate] of Object.entries(NSW_LAND_CONCESSIONAL_RATES)) {
      if (price <= parseInt(threshold)) {
        landConcessionalRate = rate;
        break;
      }
    }
    
    // Calculate concessional duty: price * concessional rate
    return price * landConcessionalRate;
  }
  
  // For land properties $450k+: use standard stamp duty rates (no concessions)
  if (propertyCategory === 'land' && price > 450000) {
    return duty; // Return the original duty calculation (no concessions)
  }
  
  // For non-land properties under $800k: full exemption
  if (price <= 800000) {
    return 0;
  }
  
  if (price >= 1000000) return duty; // No concession at or above $1M
  
  if (price > 800000 && price < 1000000) {
    // Between $800k and $1M - use existing concessional rates
    let concessionalRate = 0;
    
    // Find the appropriate rate for the price
    for (const [threshold, rate] of Object.entries(NSW_CONCESSIONAL_RATES)) {
      if (price <= parseInt(threshold)) {
        concessionalRate = rate;
        break;
      }
    }
    
    // Calculate concessional duty: price * concessional rate
    return price * concessionalRate;
  }
  
  return duty;
};

// NSW First Home Owners Grant calculation
export const calculateNSWFirstHomeOwnersGrant = (price, propertyType, propertyCategory, estimatedBuildCost = 0, isPPR = false) => {
  const grantAmount = 10000; // NSW FHOG amount
  
  // First Home Owners Grant requires the property to be the Principal Place of Residence
  if (!isPPR) {
    return 0;
  }
  
  // First Home Owners Grant is only available for off-the-plan properties
  if (propertyType !== 'off-the-plan') {
    return 0;
  }
  
  // For land: total cost must be less than $750k
  if (propertyCategory === 'land') {
    if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
      const totalCost = price + estimatedBuildCost;
      return totalCost <= NSW_FHOG_LAND_CAP ? grantAmount : 0;
    }
    return 0; // No grant if no build cost provided
  }
  
  // For other property types: $600k cap
  return price <= NSW_FHOG_PROPERTY_CAP ? grantAmount : 0;
};

// NSW Land Transfer Fee calculation
export const calculateNSWLandTransferFee = () => {
  return 155; // NSW: Standard transfer fee ~$155 incl. GST
};

// NSW Foreign Buyer Duty calculation
export const calculateNSWForeignBuyerDuty = (price, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * 0.08; // NSW foreign buyer rate is 8%
};
