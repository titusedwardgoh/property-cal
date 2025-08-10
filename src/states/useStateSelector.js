import { useState, useEffect } from 'react';

// Import NSW-specific functions
import { 
  calculateNSWStampDuty, 
  calculateNSWFirstHomeOwnersGrant, 
  calculateNSWLandTransferFee, 
  calculateNSWForeignBuyerDuty 
} from './nsw/calculations.js';

// Import VIC-specific functions
import { 
  calculateVICStampDuty, 
  calculateVICFirstHomeOwnersGrant, 
  calculateVICLandTransferFee, 
  calculateVICForeignBuyerDuty 
} from './vic/calculations.js';

// Import QLD-specific functions
import { 
  calculateQLDStampDuty, 
  calculateQLDFirstHomeOwnersGrant, 
  calculateQLDLandTransferFee, 
  calculateQLDForeignBuyerDuty 
} from './qld/calculations.js';

// Import shared functions
import { 
  calculateMonthlyRepayment, 
  calculateTotalRepayments, 
  calculateLMI,
  calculateLegalFees,
  calculateInspectionFees,
  calculateCouncilRates,
  calculateWaterRates,
  calculateBodyCorporate
} from './shared/baseCalculations.js';

// Import shared constants
import { STATE_AVERAGES, PPR_REQUIREMENTS } from './shared/commonConstants.js';

export const useStateSelector = (selectedState) => {
  const [stateFunctions, setStateFunctions] = useState(null);
  const [stateConstants, setStateConstants] = useState(null);

  useEffect(() => {
    const loadStateData = async () => {
      try {
        switch (selectedState) {
          case 'NSW':
            setStateFunctions({
              calculateStampDuty: calculateNSWStampDuty,
              calculateFirstHomeOwnersGrant: calculateNSWFirstHomeOwnersGrant,
              calculateLandTransferFee: calculateNSWLandTransferFee,
              calculateForeignBuyerDuty: calculateNSWForeignBuyerDuty,
              // Shared functions
              calculateMonthlyRepayment,
              calculateTotalRepayments,
              calculateLMI,
              calculateLegalFees,
              calculateInspectionFees,
              calculateCouncilRates,
              calculateWaterRates,
              calculateBodyCorporate
            });
            
            setStateConstants({
              stateAverage: STATE_AVERAGES.NSW,
              pprRequirement: PPR_REQUIREMENTS.NSW,
              foreignBuyerRate: 0.08,
              firstHomeOwnersGrant: 10000
            });
            break;
            
          case 'VIC':
            setStateFunctions({
              calculateStampDuty: calculateVICStampDuty,
              calculateFirstHomeOwnersGrant: calculateVICFirstHomeOwnersGrant,
              calculateLandTransferFee: calculateVICLandTransferFee,
              calculateForeignBuyerDuty: calculateVICForeignBuyerDuty,
              // Shared functions
              calculateMonthlyRepayment,
              calculateTotalRepayments,
              calculateLMI,
              calculateLegalFees,
              calculateInspectionFees,
              calculateCouncilRates,
              calculateWaterRates,
              calculateBodyCorporate
            });
            
            setStateConstants({
              stateAverage: STATE_AVERAGES.VIC,
              pprRequirement: PPR_REQUIREMENTS.VIC,
              foreignBuyerRate: 0.08,
              firstHomeOwnersGrant: 10000
            });
                         break;
             
           case 'QLD':
             setStateFunctions({
               calculateStampDuty: calculateQLDStampDuty,
               calculateFirstHomeOwnersGrant: calculateQLDFirstHomeOwnersGrant,
               calculateLandTransferFee: calculateQLDLandTransferFee,
               calculateForeignBuyerDuty: calculateQLDForeignBuyerDuty,
               // Shared functions
               calculateMonthlyRepayment,
               calculateTotalRepayments,
               calculateLMI,
               calculateLegalFees,
               calculateInspectionFees,
               calculateCouncilRates,
               calculateWaterRates,
               calculateBodyCorporate
             });
             
             setStateConstants({
               stateAverage: STATE_AVERAGES.QLD,
               pprRequirement: PPR_REQUIREMENTS.QLD,
               foreignBuyerRate: 0.07,
               firstHomeOwnersGrant: 30000
             });
             break;
             
           default:
             // For now, fall back to NSW for other states
             // This will be expanded as we add more states
            setStateFunctions({
              calculateStampDuty: calculateNSWStampDuty,
              calculateFirstHomeOwnersGrant: calculateNSWFirstHomeOwnersGrant,
              calculateLandTransferFee: calculateNSWLandTransferFee,
              calculateForeignBuyerDuty: calculateNSWForeignBuyerDuty,
              // Shared functions
              calculateMonthlyRepayment,
              calculateTotalRepayments,
              calculateLMI,
              calculateLegalFees,
              calculateInspectionFees,
              calculateCouncilRates,
              calculateWaterRates,
              calculateBodyCorporate
            });
            
            setStateConstants({
              stateAverage: STATE_AVERAGES[selectedState] || STATE_AVERAGES.NSW,
              pprRequirement: PPR_REQUIREMENTS[selectedState] || PPR_REQUIREMENTS.NSW,
              foreignBuyerRate: 0.08, // Default fallback
              firstHomeOwnersGrant: 10000 // Default fallback
            });
        }
      } catch (error) {
        console.error('Error loading state data:', error);
        // Fallback to NSW if there's an error
        setStateFunctions({
          calculateStampDuty: calculateNSWStampDuty,
          calculateFirstHomeOwnersGrant: calculateNSWFirstHomeOwnersGrant,
          calculateLandTransferFee: calculateNSWLandTransferFee,
          calculateForeignBuyerDuty: calculateNSWForeignBuyerDuty,
          // Shared functions
          calculateMonthlyRepayment,
          calculateTotalRepayments,
          calculateLMI,
          calculateLegalFees,
          calculateInspectionFees,
          calculateCouncilRates,
          calculateWaterRates,
          calculateBodyCorporate
        });
        
        setStateConstants({
          stateAverage: STATE_AVERAGES.NSW,
          pprRequirement: PPR_REQUIREMENTS.NSW,
          foreignBuyerRate: 0.08,
          firstHomeOwnersGrant: 10000
        });
      }
    };

    if (selectedState) {
      loadStateData();
    }
  }, [selectedState]);

  return {
    stateFunctions,
    stateConstants,
    isLoading: !stateFunctions || !stateConstants
  };
};
