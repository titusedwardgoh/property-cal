import { VIC_STAMP_DUTY_RATES } from './constants.js';

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

  // Find the applicable rate bracket
  let applicableRate = null;
  for (const bracket of VIC_STAMP_DUTY_RATES) {
    if (price > bracket.min && price <= bracket.max) {
      applicableRate = bracket;
      break;
    }
  }

  if (!applicableRate) {
    return 0;
  }

  // Calculate stamp duty: price * rate + fixed fee
  const stampDuty = price * applicableRate.rate + applicableRate.fixedFee;

  return Math.round(stampDuty * 100) / 100; // Round to 2 decimal places
};
