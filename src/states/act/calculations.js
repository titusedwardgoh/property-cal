import { ACT_STAMP_DUTY_RATES } from './constants.js';

export const calculateACTStampDuty = (propertyPrice, selectedState) => {
  // Only calculate if ACT is selected
  if (selectedState !== 'ACT') {
    return 0;
  }

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;
  
  if (price <= 0) {
    return 0;
  }

  // Find the applicable rate bracket
  let applicableRate = null;
  for (const bracket of ACT_STAMP_DUTY_RATES) {
    if (price > bracket.min && price <= bracket.max) {
      applicableRate = bracket;
      break;
    }
  }

  if (!applicableRate) {
    return 0;
  }

  // Special case for properties over $1,455,000 - flat rate on total value
  if (price > 1455000) {
    return price * applicableRate.rate;
  }

  // Calculate stamp duty: (price - min) * rate + fixed fee
  const stampDuty = (price - applicableRate.min) * applicableRate.rate + applicableRate.fixedFee;

  return stampDuty;
};
