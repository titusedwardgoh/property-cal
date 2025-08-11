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

// Import NT-specific functions
import { 
  calculateNTStampDuty, 
  calculateNTFirstHomeOwnersGrant, 
  calculateNTLandTransferFee, 
  calculateNTForeignBuyerDuty 
} from './nt/calculations.js';

// Import ACT-specific functions
import { 
  calculateACTStampDuty, 
  calculateACTFirstHomeOwnersGrant, 
  calculateACTLandTransferFee, 
  calculateACTForeignBuyerDuty 
} from './act/calculations.js';

// Import shared functions
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

// No shared constants needed anymore

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
              stateAverage: 1200000, // NSW_STATE_AVERAGE
              pprRequirement: 'Must live for 6 months within 12 months of settlement', // NSW_PPR_REQUIREMENT
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
              stateAverage: 900000, // VIC_STATE_AVERAGE
              pprRequirement: 'Must live for 12 months within 12 months of settlement', // VIC_PPR_REQUIREMENT
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
              stateAverage: 650000, // QLD_STATE_AVERAGE
              pprRequirement: 'Must live for 6 months within 12 months of settlement', // QLD_PPR_REQUIREMENT
              foreignBuyerRate: 0.07,
              firstHomeOwnersGrant: 30000
            });
             break;
             
           case 'NT':
             setStateFunctions({
               calculateStampDuty: calculateNTStampDuty,
               calculateFirstHomeOwnersGrant: calculateNTFirstHomeOwnersGrant,
               calculateLandTransferFee: calculateNTLandTransferFee,
               calculateForeignBuyerDuty: calculateNTForeignBuyerDuty,
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
              stateAverage: 500000, // NT_STATE_AVERAGE
              pprRequirement: 'Must live for 12 months within 12 months of settlement', // NT_PPR_REQUIREMENT
              foreignBuyerRate: 0.07,
              firstHomeOwnersGrant: 10000
            });
                           break;
              
            case 'ACT':
              setStateFunctions({
                calculateStampDuty: calculateACTStampDuty,
                calculateFirstHomeOwnersGrant: calculateACTFirstHomeOwnersGrant,
                calculateLandTransferFee: calculateACTLandTransferFee,
                calculateForeignBuyerDuty: calculateACTForeignBuyerDuty,
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
              stateAverage: 800000, // ACT_STATE_AVERAGE
              pprRequirement: 'Must live for 12 months within 12 months of settlement', // ACT_PPR_REQUIREMENT
              foreignBuyerRate: 0.08,
              firstHomeOwnersGrant: 7000
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
              stateAverage: 1200000, // Default to NSW average
              pprRequirement: 'Must live for 6 months within 12 months of settlement', // Default to NSW requirement
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
          stateAverage: 1200000, // NSW_STATE_AVERAGE
          pprRequirement: 'Must live for 6 months within 12 months of settlement', // NSW_PPR_REQUIREMENT
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
