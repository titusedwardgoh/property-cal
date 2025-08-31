import { VIC_STAMP_DUTY_RATES, VIC_FIRST_HOME_OWNERS_GRANT, VIC_FHOG_PROPERTY_CAP, VIC_FHOG_LAND_CAP, VIC_FOREIGN_BUYER_RATE, VIC_FHB_CONCESSIONAL_RATES, VIC_PPR_CONCESSIONAL_RATES } from './constants.js';

export const calculateVICStampDuty = (propertyPrice, selectedState) => {
  // Only calculate if VIC is selected
  if (selectedState !== 'VIC') {
    return 0;
  }

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;
  
  if (price <= 0) {
    return 0;
  }

  let stampDuty = 0;

  // Progressive calculation based on VIC stamp duty structure
  if (price <= 25000) {
    // $0 - $25,000: 1.4% of the dutiable value
    stampDuty = price * 0.014;
  } else if (price <= 130000) {
    // >$25,000 - $130,000: $350 plus 2.4% of the dutiable value in excess of $25,000
    stampDuty = 350 + (price - 25000) * 0.024;
  } else if (price <= 960000) {
    // >$130,000 - $960,000: $2,870 plus 6% of the dutiable value in excess of $130,000
    stampDuty = 2870 + (price - 130000) * 0.06;
  } else if (price <= 2000000) {
    // >$960,000 - $2,000,000: 5.5% of the dutiable value
    stampDuty = price * 0.055;
  } else {
    // More than $2,000,000: $110,000 plus 6.5% of the dutiable value in excess of $2,000,000
    stampDuty = 110000 + (price - 2000000) * 0.065;
  }

  return Math.round(stampDuty * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate VIC First Home Owners Grant eligibility and amount
 * @param {Object} buyerData - Buyer information
 * @param {Object} propertyData - Property information
 * @param {string} selectedState - Selected state (must be 'VIC')
 * @returns {Object} - Eligibility result with amount and details
 */
export const calculateVICFirstHomeOwnersGrant = (buyerData, propertyData, selectedState) => {
  // Only calculate if VIC is selected
  if (selectedState !== 'VIC') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Not VIC'
    };
  }

  const {
    buyerType,
    isPPR,
    isAustralianResident,
    isFirstHomeBuyer
  } = buyerData;

  const {
    propertyPrice,
    propertyType,
    propertyCategory
  } = propertyData;

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;

  // Check basic eligibility criteria
  if (buyerType !== 'owner-occupier') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Must be owner-occupier, not investor'
    };
  }

  if (isPPR !== 'yes') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Must be principal place of residence (PPR)'
    };
  }

  if (isAustralianResident !== 'yes') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Must be Australian resident, not foreign buyer'
    };
  }

  if (isFirstHomeBuyer !== 'yes') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Must be first home buyer'
    };
  }

  // Check property type eligibility - new, off-the-plan, and house-and-land properties are eligible in VIC
  if (propertyType !== 'new' && propertyType !== 'off-the-plan' && propertyType !== 'house-and-land') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Only new, off-the-plan and house and land packages are eligible for VIC First Home Owners Grant'
    };
  }

  // Check property price caps based on property category
  let priceCap;
  if (propertyCategory === 'land') {
    // For land properties (including house and land packages)
    priceCap = VIC_FHOG_LAND_CAP; // $750,000
  } else {
    // For non-land properties (house, apartment, townhouse)
    priceCap = VIC_FHOG_PROPERTY_CAP; // $750,000
  }

  if (price > priceCap) {
    return {
      eligible: false,
      amount: 0,
      reason: `Property price $${price.toLocaleString()} exceeds cap of $${priceCap.toLocaleString()} for ${propertyCategory === 'land' ? 'land' : 'non-land'} properties`
    };
  }

  // All criteria met - eligible for grant
  return {
    eligible: true,
    amount: VIC_FIRST_HOME_OWNERS_GRANT, // $10,000
    reason: 'Eligible for VIC First Home Owners Grant',
    details: {
      propertyType,
      propertyCategory,
      priceCap,
      grantAmount: VIC_FIRST_HOME_OWNERS_GRANT
    }
  };
};

/**
 * Calculate VIC Foreign Purchaser Duty
 * @param {Object} buyerData - Buyer information
 * @param {Object} propertyData - Property information
 * @param {string} selectedState - Selected state (must be 'VIC')
 * @returns {Object} - Foreign purchaser duty result with amount and details
 */
export const calculateVICForeignPurchaserDuty = (buyerData, propertyData, selectedState) => {
  // Only calculate if VIC is selected
  if (selectedState !== 'VIC') {
    return {
      applicable: false,
      amount: 0,
      reason: 'Not VIC'
    };
  }

  const {
    isAustralianResident
  } = buyerData;

  const {
    propertyPrice
  } = propertyData;

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;

  // Check if foreign purchaser duty applies
  if (isAustralianResident !== 'no') {
    return {
      applicable: false,
      amount: 0,
      reason: 'Australian resident - no foreign purchaser duty'
    };
  }

  if (price <= 0) {
    return {
      applicable: false,
      amount: 0,
      reason: 'Invalid property price'
    };
  }

  // Calculate foreign purchaser duty: property price × 8%
  const foreignPurchaserDuty = price * VIC_FOREIGN_BUYER_RATE;

  return {
    applicable: true,
    amount: foreignPurchaserDuty,
    reason: 'Foreign purchaser duty applies (8% of property price)',
    details: {
      propertyPrice: price,
      rate: VIC_FOREIGN_BUYER_RATE,
      calculation: `${price.toLocaleString()} × ${(VIC_FOREIGN_BUYER_RATE * 100)}% = $${foreignPurchaserDuty.toLocaleString()}`
    }
  };
};

/**
 * Calculate VIC First Home Buyer Duty Concession
 * @param {Object} buyerData - Buyer information
 * @param {Object} propertyData - Property information
 * @param {string} selectedState - Selected state (must be 'VIC')
 * @param {number} stampDutyAmount - Calculated stamp duty amount
 * @returns {Object} - Concession result with amount and details
 */
export const calculateVICFirstHomeBuyerDutyConcession = (buyerData, propertyData, selectedState, stampDutyAmount) => {
  // Only calculate if VIC is selected
  if (selectedState !== 'VIC') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Not VIC'
    };
  }

  const {
    buyerType,
    isPPR,
    isAustralianResident,
    isFirstHomeBuyer
  } = buyerData;

  const {
    propertyPrice
  } = propertyData;

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;

  // Check basic eligibility criteria
  if (buyerType !== 'owner-occupier') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Must be owner-occupier, not investor'
    };
  }

  if (isPPR !== 'yes') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Must be principal place of residence (PPR)'
    };
  }

  if (isAustralianResident !== 'yes') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Must be Australian resident, not foreign buyer'
    };
  }

  if (isFirstHomeBuyer !== 'yes') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Must be first home buyer'
    };
  }

  if (price <= 0) {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Invalid property price'
    };
  }

  // VIC First Home Buyer Duty Concession applies to all property types
  let concessionAmount = 0;

  if (price < 600000) {
    // Full concession: property price below $600k
    concessionAmount = stampDutyAmount;
  } else if (price >= 750000) {
    // No concession: property price $750k and above
    concessionAmount = 0;
  } else {
    // Partial concession: property price between $600k and $750k
    // Use interpolation with concessional rates
    const sortedRates = Object.entries(VIC_FHB_CONCESSIONAL_RATES)
      .sort(([a], [b]) => parseInt(a) - parseInt(b));
    
    let lowerPrice = 0;
    let lowerRate = 0;
    let upperPrice = 0;
    let upperRate = 0;
    
    for (let i = 0; i < sortedRates.length; i++) {
      const [ratePrice, rate] = sortedRates[i];
      const currentPrice = parseInt(ratePrice);
      
      if (price <= currentPrice) {
        upperPrice = currentPrice;
        upperRate = rate;
        
        if (i > 0) {
          const [prevPrice, prevRate] = sortedRates[i - 1];
          lowerPrice = parseInt(prevPrice);
          lowerRate = prevRate;
        }
        break;
      }
    }
    
    let applicableRate;
    if (lowerPrice > 0 && upperPrice > 0) {
      // Interpolate between two rates
      applicableRate = lowerRate + (upperRate - lowerRate) * (price - lowerPrice) / (upperPrice - lowerPrice);
    } else {
      // Use the upper rate directly
      applicableRate = upperRate;
    }
    
    // Calculate concessional amount using the interpolated rate
    const concessionalAmount = price * applicableRate; // Use decimal rate directly
    concessionAmount = Math.max(0, stampDutyAmount - concessionalAmount);
  }

  return {
    eligible: true,
    concessionAmount: concessionAmount,
    reason: concessionAmount > 0
      ? 'Eligible for VIC First Home Buyer Duty Concession'
      : 'You are an eligible buyer but your property price is outside of the concession range',
    details: {
      propertyPrice: price,
      stampDutyAmount: stampDutyAmount,
      concessionAmount: concessionAmount,
      netStampDuty: stampDutyAmount - concessionAmount,
      threshold600k: price < 600000,
      threshold750k: price >= 750000,
      partialConcession: price >= 600000 && price < 750000
    }
  };
};

/**
 * Calculate VIC PPR Duty Concession
 * @param {Object} buyerData - Buyer information
 * @param {Object} propertyData - Property information
 * @param {string} selectedState - Selected state (must be 'VIC')
 * @param {number} stampDutyAmount - Calculated stamp duty amount
 * @returns {Object} - PPR concession result with amount and details
 */
export const calculateVICPPRConcession = (buyerData, propertyData, selectedState, stampDutyAmount) => {
  // Only calculate if VIC is selected
  if (selectedState !== 'VIC') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Not VIC'
    };
  }

  const {
    buyerType,
    isPPR,
    isAustralianResident,
    isFirstHomeBuyer
  } = buyerData;

  const {
    propertyPrice,
    propertyType
  } = propertyData;

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;

  // Check basic eligibility criteria for PPR concession
  if (buyerType !== 'owner-occupier') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Must be owner-occupier, not investor'
    };
  }

  if (isPPR !== 'yes') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Must be principal place of residence (PPR)'
    };
  }

  // Foreign buyers are eligible for PPR concession
  // No restriction on isAustralianResident

  // For first home buyers, we need to check if they're foreign
  // Foreign first home buyers can get PPR concession as a fallback
  // Australian first home buyers should use First Home Buyer Duty Concession instead
  if (isFirstHomeBuyer === 'yes' && isAustralianResident === 'yes') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Australian first home buyers should use First Home Buyer Duty Concession instead'
    };
  }

  // Check property type - PPR concession applies to all property types except vacant land
  if (propertyType === 'vacant-land-only') {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'PPR concession does not apply to vacant land'
    };
  }

  if (price <= 0) {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: 'Invalid property price'
    };
  }

  // PPR concession only applies to properties between $130,000 and $550,000
  if (price < 130000 || price > 550000) {
    return {
      eligible: false,
      concessionAmount: 0,
      reason: `PPR concession only applies to properties valued between $130,000 and $550,000. Your property is valued at $${price.toLocaleString()}`
    };
  }

  // Calculate PPR concessional stamp duty
  let pprStampDuty = 0;
  
  if (price <= 440000) {
    // $130,000 to $440,000: $2,870 plus 5% of amount >$130,000
    pprStampDuty = 2870 + (price - 130000) * 0.05;
  } else {
    // $440,000 to $550,000: $18,370 plus 6% of amount >$440,000
    pprStampDuty = 18370 + (price - 440000) * 0.06;
  }

  // Calculate concession amount (difference between base stamp duty and PPR stamp duty)
  const concessionAmount = Math.max(0, stampDutyAmount - pprStampDuty);

  return {
    eligible: true,
    concessionAmount: concessionAmount,
    reason: 'Eligible for VIC PPR Duty Concession',
    details: {
      propertyPrice: price,
      baseStampDuty: stampDutyAmount,
      pprStampDuty: pprStampDuty,
      concessionAmount: concessionAmount,
      netStampDuty: pprStampDuty,
      pprRange: '130,000 - 550,000',
      applicableRate: price <= 440000 ? '5%' : '6%',
      fixedFee: price <= 440000 ? 2870 : 18370
    }
  };
};
