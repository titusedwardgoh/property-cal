import { useState, useEffect } from 'react';

// Import state-specific functions
import { calculateNSWStampDuty } from './nsw/calculations.js';
import { calculateVICStampDuty } from './vic/calculations.js';
import { calculateQLDStampDuty } from './qld/calculations.js';
import { calculateSAStampDuty } from './sa/calculations.js';
import { calculateWAStampDuty } from './wa/calculations.js';
import { calculateTASStampDuty } from './tas/calculations.js';
import { calculateACTStampDuty } from './act/calculations.js';
import { calculateNTStampDuty } from './nt/calculations.js';

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
  // Use appropriate stamp duty function based on selected state
  const getStampDutyFunction = () => {
    switch (selectedState) {
      case 'NSW':
        return calculateNSWStampDuty;
      case 'VIC':
        return calculateVICStampDuty;
      case 'QLD':
        return calculateQLDStampDuty;
      case 'SA':
        return calculateSAStampDuty;
      case 'WA':
        return calculateWAStampDuty;
      case 'TAS':
        return calculateTASStampDuty;
      case 'ACT':
        return calculateACTStampDuty;
      case 'NT':
        return calculateNTStampDuty;
      default:
        return () => 0; // Placeholder for other states
    }
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
    stateAverage: selectedState === 'NSW' ? 1200000 : 
                 selectedState === 'VIC' ? 900000 : 
                 selectedState === 'QLD' ? 650000 : 
                 selectedState === 'SA' ? 600000 : 
                 selectedState === 'WA' ? 550000 : 
                 selectedState === 'TAS' ? 450000 : 
                 selectedState === 'ACT' ? 800000 : 
                 selectedState === 'NT' ? 500000 : 800000,
    pprRequirement: selectedState === 'NSW' ? 'Must live for 6 months within 12 months of settlement' : 
                   selectedState === 'VIC' ? 'Must live for 12 months within 12 months of settlement' : 
                   selectedState === 'QLD' ? 'Must live for 6 months within 12 months of settlement' :
                   selectedState === 'SA' ? 'Must live for 6 months within 12 months of settlement' :
                   selectedState === 'WA' ? 'Must live for 6 months within 12 months of settlement' :
                   selectedState === 'TAS' ? 'Must live for 6 months within 12 months of settlement' :
                   selectedState === 'ACT' ? 'Must live for 12 months within 12 months of settlement' :
                   selectedState === 'NT' ? 'Must live for 12 months within 12 months of settlement' :
                   'Placeholder requirement',
    foreignBuyerRate: selectedState === 'VIC' ? 0.08 : 
                     selectedState === 'QLD' ? 0.07 : 
                     selectedState === 'SA' ? 0.07 : 
                     selectedState === 'WA' ? 0.07 : 
                     selectedState === 'TAS' ? 0.08 : 
                     selectedState === 'ACT' ? 0.08 : 
                     selectedState === 'NT' ? 0.07 : 0.08,
    firstHomeOwnersGrant: selectedState === 'NSW' ? 10000 : 
                          selectedState === 'VIC' ? 10000 : 
                          selectedState === 'QLD' ? 30000 : 
                          selectedState === 'SA' ? 15000 : 
                          selectedState === 'WA' ? 10000 : 
                          selectedState === 'TAS' ? 30000 : 
                          selectedState === 'ACT' ? 7000 : 
                          selectedState === 'NT' ? 10000 : 10000
  };

  return {
    stateFunctions,
    stateConstants,
    isLoading: false
  };
};
