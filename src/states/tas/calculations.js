import { TAS_STAMP_DUTY_RATES } from './constants.js';

export const calculateTASStampDuty = (propertyPrice, selectedState) => {
  // Only calculate if TAS is selected
  if (selectedState !== 'TAS') {
    return 0;
  }

  // Convert propertyPrice to number if it's a string
  const price = parseInt(propertyPrice) || 0;
  
  if (price <= 0) {
    return 0;
  }

  // Find the applicable rate bracket
  let applicableRate = null;
  for (const bracket of TAS_STAMP_DUTY_RATES) {
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
