import { WA_STAMP_DUTY_RATES, WA_FIRST_HOME_OWNERS_GRANT, WA_FHOG_PROPERTY_CAP_SOUTH, WA_FHOG_PROPERTY_CAP_NORTH } from './constants.js';

export const calculateWAStampDuty = (propertyPrice, selectedState) => {
  // Only calculate if WA is selected
  if (selectedState !== 'WA') {
    return 0;
  }

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;
  
  if (price <= 0) {
    return 0;
  }

  // Find the applicable rate bracket
  let applicableRate = null;
  for (const bracket of WA_STAMP_DUTY_RATES) {
    if (price > bracket.min && price <= bracket.max) {
      applicableRate = bracket;
      break;
    }
  }

  if (!applicableRate) {
    return 0;
  }

  // Calculate stamp duty: (price - min) * rate + fixed fee
  const stampDuty = (price - applicableRate.min) * applicableRate.rate + applicableRate.fixedFee;

  return stampDuty;
};

/**
 * Calculate WA First Home Owners Grant
 * @param {Object} buyerData - Buyer information
 * @param {Object} propertyData - Property information
 * @param {string} selectedState - Selected state (must be 'WA')
 * @returns {Object} - Grant result with amount and details
 */
export const calculateWAFirstHomeOwnersGrant = (buyerData, propertyData, selectedState) => {
  // Only calculate if WA is selected
  if (selectedState !== 'WA') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Not WA'
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
    isWA,
    isWAMetro
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

  if (price <= 0) {
    return {
      eligible: false,
      amount: 0,
      reason: 'Invalid property price'
    };
  }

  // Check WA region selection
  if (!isWA || (isWA !== 'north' && isWA !== 'south')) {
    return {
      eligible: false,
      amount: 0,
      reason: 'Please select North or South WA location'
    };
  }

  // Check WA metro selection
  if (!isWAMetro || (isWAMetro !== 'metro' && isWAMetro !== 'non-metro')) {
    return {
      eligible: false,
      amount: 0,
      reason: 'Please select Metro or Non-Metro location'
    };
  }

  // WA FHOG applies to new, off-the-plan, and house-and-land properties
  if (propertyType !== 'new' && propertyType !== 'off-the-plan' && propertyType !== 'house-and-land') {
    return {
      eligible: false,
      amount: 0,
      reason: 'WA First Home Owners Grant only applies to new, off-the-plan, and house-and-land properties'
    };
  }

  // Check property price cap based on WA region
  const priceCap = isWA === 'south' ? WA_FHOG_PROPERTY_CAP_SOUTH : WA_FHOG_PROPERTY_CAP_NORTH;
  const regionLabel = isWA === 'south' ? 'South WA' : 'North WA';
  
  if (price > priceCap) {
    return {
      eligible: false,
      amount: 0,
      reason: `WA First Home Owners Grant only applies to properties valued at $${priceCap.toLocaleString()} for this property's location. Your property is valued at $${price.toLocaleString()}`
    };
  }

  // All criteria met - eligible for full grant
  return {
    eligible: true,
    amount: WA_FIRST_HOME_OWNERS_GRANT,
    reason: `Eligible for WA First Home Owners Grant (${regionLabel})`,
    details: {
      propertyPrice: price,
      grantAmount: WA_FIRST_HOME_OWNERS_GRANT,
      propertyType: propertyType,
      priceCap: priceCap,
      region: regionLabel,
      metro: isWAMetro === 'metro' ? 'Metro' : 'Non-Metro',
      note: `Grant available for eligible properties up to $${priceCap.toLocaleString()} in ${regionLabel}`
    }
  };
};

/**
 * Calculate all upfront costs for WA
 * @param {Object} buyerData - Buyer information
 * @param {Object} propertyData - Property information
 * @param {string} selectedState - Selected state (must be 'WA')
 * @returns {Object} - Complete upfront costs breakdown
 */
export const calculateUpfrontCosts = (buyerData, propertyData, selectedState) => {
  // Only calculate if WA is selected
  if (selectedState !== 'WA') {
    return {
      stampDuty: { amount: 0, label: "Stamp Duty" },
      concessions: [],
      grants: [],
      foreignDuty: { amount: 0, applicable: false },
      netStateDuty: 0,
      totalUpfrontCosts: 0
    };
  }

  const price = parseInt(propertyData.propertyPrice) || 0;
  
  // Calculate base stamp duty
  const stampDutyAmount = calculateWAStampDuty(price, selectedState);
  
  // Calculate first home owners grant
  const grantResult = calculateWAFirstHomeOwnersGrant(buyerData, propertyData, selectedState);
  
  // Calculate net state duty (stamp duty minus any concessions - none for WA yet)
  const netStateDuty = stampDutyAmount;
  
  // Calculate total upfront costs (including property price if no loan needed, minus grants)
  const propertyPrice = (buyerData.needsLoan === 'no') ? price : 0;
  const totalUpfrontCosts = netStateDuty + propertyPrice - (grantResult.eligible ? grantResult.amount : 0);
  
  return {
    stampDuty: { amount: stampDutyAmount, label: "Stamp Duty" },
    concessions: [], // No concessions implemented yet for WA
    ineligibleConcessions: [], // No concessions implemented yet for WA
    grants: grantResult.eligible ? [grantResult] : [],
    foreignDuty: { amount: 0, applicable: false }, // Not implemented yet
    netStateDuty: netStateDuty,
    totalUpfrontCosts: totalUpfrontCosts,
    // Include all grant data for display purposes
    allGrants: {
      firstHomeOwners: grantResult
    }
  };
};
