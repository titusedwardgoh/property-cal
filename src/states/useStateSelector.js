import { useState, useEffect } from 'react';

// Import NSW functions
import { calculateNSWStampDuty } from './nsw/calculations.js';

// Import shared functions only (these exist)
import { 
  calculateMonthlyRepayment, 
  calculateTotalRepayments, 
  calculateLMI
} from './shared/loanCalculations.js';

import { 
  calculateLegalFees,
  calculateInspectionFees,
  calculateCouncilRates,
  calculateWaterRates,
  calculateBodyCorporate
} from './shared/hiddenFees.js';

export const useStateSelector = (selectedState) => {
  // Use NSW stamp duty function if NSW is selected, otherwise placeholder
  const getStampDutyFunction = () => {
    if (selectedState === 'NSW') {
      return calculateNSWStampDuty;
    }
    return () => 0; // Placeholder for other states
  };
  
  const stateFunctions = {
    calculateStampDuty: getStampDutyFunction(),
    // Shared functions that exist
    calculateMonthlyRepayment,
    calculateTotalRepayments,
    calculateLMI,
    calculateLegalFees,
    calculateInspectionFees,
    calculateCouncilRates,
    calculateWaterRates,
    calculateBodyCorporate
  };
  
  const stateConstants = {
    stateAverage: selectedState === 'NSW' ? 1200000 : 800000,
    pprRequirement: selectedState === 'NSW' ? 'Must live for 6 months within 12 months of settlement' : 'Placeholder requirement',
    foreignBuyerRate: 0.08,
    firstHomeOwnersGrant: selectedState === 'NSW' ? 10000 : 10000
  };

  return {
    stateFunctions,
    stateConstants,
    isLoading: false
  };
};
