import { NSW_STAMP_DUTY_RATES, NSW_FIRST_HOME_OWNERS_GRANT, NSW_FHOG_PROPERTY_CAP, NSW_FHOG_LAND_CAP } from './constants.js';

export const calculateNSWStampDuty = (propertyPrice, selectedState) => {
  // Only calculate if NSW is selected
  if (selectedState !== 'NSW') {
    return 0;
  }

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;
  
  if (price <= 0) {
    return 0;
  }

  // Find the applicable rate bracket
  let applicableRate = null;
  for (const bracket of NSW_STAMP_DUTY_RATES) {
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
 * Calculate NSW First Home Owners Grant eligibility and amount
 * @param {Object} buyerData - Buyer information
 * @param {Object} propertyData - Property information
 * @param {string} selectedState - Selected state (must be 'NSW')
 * @returns {Object} - Eligibility result with amount and details
 */
export const calculateNSWFirstHomeOwnersGrant = (buyerData, propertyData, selectedState) => {
  // Only calculate if NSW is selected
  if (selectedState !== 'NSW') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Not NSW'
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

  // Check property type eligibility - new properties, off-the-plan, and house and land are eligible
  if (propertyType !== 'new' && propertyType !== 'off-the-plan' && propertyType !== 'house-and-land') {
    return {
      eligible: false,
      amount: 0,
      reason: 'Only new, off-the-plan and house and land packages are eligible'
    };
  }

  // Check property price caps based on property category
  let priceCap;
  if (propertyCategory === 'land') {
    // For land properties (including house and land packages)
    priceCap = NSW_FHOG_LAND_CAP; // $750,000
  } else {
    // For non-land properties (house, apartment, townhouse)
    priceCap = NSW_FHOG_PROPERTY_CAP; // $600,000
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
    amount: NSW_FIRST_HOME_OWNERS_GRANT, // $10,000
    reason: 'Eligible for NSW First Home Owners Grant',
    details: {
      propertyType,
      propertyCategory,
      priceCap,
      grantAmount: NSW_FIRST_HOME_OWNERS_GRANT
    }
  };
};
