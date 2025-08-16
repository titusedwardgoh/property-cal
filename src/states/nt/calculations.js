import { NT_STAMP_DUTY_FORMULA, NT_FIRST_HOME_CONCESSION_BRACKETS, NT_FOREIGN_BUYER_RATE, NT_STAMP_DUTY_RATES } from './constants.js';

/**
 * Calculate NT stamp duty using the formula: (0.06571441 x V²) + 15V for properties up to $525,000
 * For properties over $525,000, standard percentage rates apply
 * where V = 1/1000 of the property value
 * @param {number} propertyPrice - The property price in dollars
 * @param {string} selectedState - The selected state (must be 'NT')
 * @returns {number} - The calculated stamp duty amount
 */
export const calculateNTStampDuty = (propertyPrice, selectedState) => {
  // Only calculate if NT is selected
  if (selectedState !== 'NT') {
    return 0;
  }

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;
  
  if (price <= 0) {
    return 0;
  }

  // Find the applicable rate bracket
  let applicableRate = null;
  for (const bracket of NT_STAMP_DUTY_RATES) {
    if (price > bracket.min && price <= bracket.max) {
      applicableRate = bracket;
      break;
    }
  }

  if (!applicableRate) {
    return 0;
  }

  let stampDuty = 0;

  if (applicableRate.rate === 'formula') {
    // Use formula for properties up to $525,000
    // Calculate V (1/1000 of property value)
    const V = price / NT_STAMP_DUTY_FORMULA.V_DIVISOR;
    
    // Apply the formula: (0.06571441 x V²) + 15V
    stampDuty = (NT_STAMP_DUTY_FORMULA.COEFFICIENT * V * V) + (NT_STAMP_DUTY_FORMULA.LINEAR_TERM * V);
  } else {
    // Use percentage rate for properties over $525,000
    stampDuty = price * applicableRate.rate + (applicableRate.fixedFee || 0);
  }
  
  return Math.round(stampDuty * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate NT first home buyer concession
 * @param {number} propertyPrice - The property price in dollars
 * @param {boolean} isFirstHomeBuyer - Whether the buyer is a first home buyer
 * @param {boolean} isPPR - Whether the property is principal place of residence
 * @returns {number} - The concession amount
 */
export const calculateNTFirstHomeConcession = (propertyPrice, isFirstHomeBuyer, isPPR) => {
  if (!isFirstHomeBuyer || !isPPR) {
    return 0;
  }

  const price = parseInt(propertyPrice) || 0;
  
  // Find applicable concession bracket
  for (const bracket of NT_FIRST_HOME_CONCESSION_BRACKETS) {
    if (price > bracket.min && price <= bracket.max) {
      return bracket.concession;
    }
  }
  
  return 0;
};

/**
 * Calculate NT foreign buyer additional duty
 * @param {number} stampDuty - The base stamp duty amount
 * @param {boolean} isForeignBuyer - Whether the buyer is a foreign buyer
 * @returns {number} - The additional duty amount
 */
export const calculateNTForeignBuyerDuty = (stampDuty, isForeignBuyer) => {
  if (!isForeignBuyer) {
    return 0;
  }
  
  return stampDuty * NT_FOREIGN_BUYER_RATE;
};

/**
 * Calculate total NT stamp duty including concessions and foreign buyer duty
 * @param {number} propertyPrice - The property price in dollars
 * @param {string} selectedState - The selected state
 * @param {boolean} isFirstHomeBuyer - Whether the buyer is a first home buyer
 * @param {boolean} isPPR - Whether the property is principal place of residence
 * @param {boolean} isForeignBuyer - Whether the buyer is a foreign buyer
 * @returns {object} - Object containing breakdown of stamp duty calculation
 */
export const calculateNTTotalStampDuty = (propertyPrice, selectedState, isFirstHomeBuyer = false, isPPR = false, isForeignBuyer = false) => {
  const baseStampDuty = calculateNTStampDuty(propertyPrice, selectedState);
  const firstHomeConcession = calculateNTFirstHomeConcession(propertyPrice, isFirstHomeBuyer, isPPR);
  const foreignBuyerDuty = calculateNTForeignBuyerDuty(baseStampDuty, isForeignBuyer);
  
  const totalStampDuty = baseStampDuty - firstHomeConcession + foreignBuyerDuty;
  
  return {
    baseStampDuty,
    firstHomeConcession,
    foreignBuyerDuty,
    totalStampDuty: Math.max(0, totalStampDuty),
    breakdown: {
      formula: `(${NT_STAMP_DUTY_FORMULA.COEFFICIENT} × V²) + (${NT_STAMP_DUTY_FORMULA.LINEAR_TERM} × V)`,
      V: (parseInt(propertyPrice) || 0) / NT_STAMP_DUTY_FORMULA.V_DIVISOR,
      explanation: `V = ${propertyPrice || 0} ÷ ${NT_STAMP_DUTY_FORMULA.V_DIVISOR} = ${((parseInt(propertyPrice) || 0) / NT_STAMP_DUTY_FORMULA.V_DIVISOR).toFixed(3)}`
    }
  };
};
