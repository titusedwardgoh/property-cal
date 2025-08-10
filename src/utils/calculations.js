import { STAMP_DUTY_RATES, ACT_OWNER_OCCUPIER_RATES, ACT_INVESTOR_RATES, FOREIGN_BUYER_RATES, STATE_AVERAGES, FIRST_HOME_OWNERS_GRANT, WA_STAMP_DUTY_CONCESSIONS } from '../data/constants.js';

export const calculateStampDuty = (price, state, isFirstHomeBuyer = false, isInvestor = false, isPPR = false, propertyType = 'existing', claimVacantLandConcession = false, propertyCategory = null, waRegion = null, constructionStarted = false) => {
  let duty = 0;
  
  // Queensland Vacant Land Concession: If claimed, stamp duty is $0 with no caps
  if (state === 'QLD' && claimVacantLandConcession) {
    return 0;
  }

  // Return 0 if no price or no state
  if (!price || price <= 0 || !state) {
    return 0;
  }
  
  // Queensland special handling: PPR properties get home concession rates regardless of citizenship
  // First home buyers get additional concessions on top of the home concession rates

  // Special handling for Northern Territory properties under $525,000
  if (state === 'NT' && price <= 525000) {
    // NT has a special formula for properties under $525,000
    // Duty = (0.06571441 × V²) + 15 × V, where V = dutiable value ÷ 1,000
    const V = price / 1000;
    duty = (0.06571441 * V * V) + (15 * V);
  } else if (state === 'ACT') {
    // ACT has different rates for owner occupiers vs investors
    const rates = isInvestor ? ACT_INVESTOR_RATES : ACT_OWNER_OCCUPIER_RATES;
    
    // Find the appropriate bracket and calculate duty
    for (const bracket of rates) {
      if (price <= bracket.max) {
        // Calculate: Fixed Fee + (Rate × Amount over the bracket minimum)
        const amountOverMin = price - bracket.min;
        duty = bracket.fixedFee + (amountOverMin * bracket.rate);
        break; // Use only one bracket based on total price
      }
    }
  } else if (state === 'NT' && price > 525000) {
    // NT properties over $525,000 use flat percentage of total value
    const rates = STAMP_DUTY_RATES[state];
    
    // Find the appropriate bracket and calculate duty
    for (const bracket of rates) {
      if (price <= bracket.max) {
        // For NT over $525k: Rate × Total property value (not amount over minimum)
        duty = price * bracket.rate;
        break; // Use only one bracket based on total price
      }
    }
  } else {
    // Standard calculation for all other states using fixed fee approach
    // Note: Queensland PPR properties automatically get these home concession rates
    const rates = STAMP_DUTY_RATES[state] || STAMP_DUTY_RATES.NSW;
    
    // Find the appropriate bracket and calculate duty
    for (const bracket of rates) {
      if (price <= bracket.max) {
        // Calculate: Fixed Fee + (Rate × Amount over the bracket minimum)
        const amountOverMin = price - bracket.min;
        duty = bracket.fixedFee + (amountOverMin * bracket.rate);
        break; // Use only one bracket based on total price
      }
    }
  }

  // Off-the-plan concessions (apply regardless of first home buyer status)
  console.log('Checking off-the-plan concessions:', {
    propertyType,
    constructionStarted,
    price,
    state
  });
  
  if (propertyType === 'off-the-plan') {
    console.log('Applying off-the-plan concessions');
    duty = applyOffThePlanConcession(duty, price, state, constructionStarted);
    console.log('Duty after off-the-plan concessions:', duty);
  } else {
    console.log('Not off-the-plan property, skipping concessions');
  }
  
  // First home buyer concessions (state-specific)
  if (isFirstHomeBuyer) {
    duty = applyFirstHomeBuyerConcession(duty, price, state, isPPR, propertyType, isFirstHomeBuyer, propertyCategory, waRegion);
  }

  return duty;
};

// Helper function to calculate Queensland first home buyer concession amounts
// This applies to existing properties only - new/off-the-plan properties get full exemption
const calculateQueenslandConcession = (price) => {
  // Queensland first home buyer concession amounts based on purchase price
  // Contracts signed on or after 9 June 2024
  const concessionBrackets = [
    { min: 0, max: 709999.99, concession: 17350 },
    { min: 710000, max: 719999.99, concession: 15615 },
    { min: 720000, max: 729999.99, concession: 13880 },
    { min: 730000, max: 739999.99, concession: 12145 },
    { min: 740000, max: 749999.99, concession: 10410 },
    { min: 750000, max: 759999.99, concession: 8675 },
    { min: 760000, max: 769999.99, concession: 6940 },
    { min: 770000, max: 779999.99, concession: 5205 },
    { min: 780000, max: 789999.99, concession: 3470 },
    { min: 790000, max: 799999.99, concession: 1735 },
    { min: 800000, max: Infinity, concession: 0 } // $800,000 or more: Nil
  ];

  // Find the appropriate bracket for the price
  for (const bracket of concessionBrackets) {
    if (price >= bracket.min && price <= bracket.max) {
      return bracket.concession;
    }
  }
  
  return 0; // Default to 0 if no bracket found
};

const applyOffThePlanConcession = (duty, price, state, constructionStarted = false) => {
  switch (state) {
    case 'WA':
      // WA: Off-the-plan concessions from constants
      // Choose rates based on construction status
      const rates = constructionStarted 
        ? WA_STAMP_DUTY_CONCESSIONS.OFF_THE_PLAN.UNDER_CONSTRUCTION
        : WA_STAMP_DUTY_CONCESSIONS.OFF_THE_PLAN.PRE_CONSTRUCTION;
      
      console.log('WA Off-the-Plan Concession Debug:', {
        constructionStarted,
        price,
        duty,
        rates,
        selectedRates: constructionStarted ? 'UNDER_CONSTRUCTION' : 'PRE_CONSTRUCTION'
      });
      
      // Find the appropriate bracket
      for (const bracket of rates) {
        console.log('Checking bracket:', bracket);
        
        // Check if this bracket applies to the price
        let bracketApplies = false;
        
        if (bracket.maxValue && price <= bracket.maxValue) {
          // Bracket with maxValue (e.g., $750k and under)
          bracketApplies = true;
        } else if (bracket.minValue && price >= bracket.minValue) {
          // Bracket with minValue (e.g., $750k+)
          bracketApplies = true;
        }
        
        if (bracketApplies) {
          console.log('Bracket found:', bracket);
          if (bracket.concession === 1.0) {
            console.log('100% concession applied, returning 0');
            return 0; // 100% concession (no duty payable)
          } else {
            // Apply partial concession with maximum cap
            const maxConcession = bracket.maxConcessionAmount || 50000;
            const concessionAmount = duty * bracket.concession;
            const actualConcession = Math.min(concessionAmount, maxConcession);
            const finalDuty = Math.max(0, duty - actualConcession);
            console.log('Partial concession applied:', {
              maxConcession,
              concessionAmount,
              actualConcession,
              finalDuty,
              bracketConcession: bracket.concession
            });
            return finalDuty;
          }
        }
      }
      
      console.log('No bracket found, returning full duty:', duty);
      // If no bracket found, return full duty
      return duty;
      break;
      
    default:
      return duty; // No off-the-plan concessions for other states
  }
};

const applyFirstHomeBuyerConcession = (duty, price, state, isPPR, propertyType, isFirstHomeBuyer, propertyCategory, waRegion = null) => {
  switch (state) {
    case 'NSW':
      // NSW: First home buyer concessions for PPR properties
      if (!isPPR) {
        return duty; // No concession if not PPR
      }
      
      // Check if this is a land property - use different rates for land between $350k-$450k
      if (propertyCategory === 'land' && price >= 350000 && price <= 450000) {
        // NSW Land-specific concessional rates for properties between $350k and $450k
        const landConcessionalRates = {
          350000: 0.0000, 350001: 0.0001, 355000: 0.0020, 360000: 0.0039, 365000: 0.0057,
          370000: 0.0075, 375000: 0.0093, 380000: 0.0112, 385000: 0.0130, 390000: 0.0147,
          395000: 0.0164, 400000: 0.0181, 405000: 0.0197, 410000: 0.0212, 415000: 0.0228,
          420000: 0.0243, 425000: 0.0257, 430000: 0.0272, 435000: 0.0286, 440000: 0.0299,
          445000: 0.0313, 450000: 0.0326
        };
        
        // Find the appropriate rate for the price
        let landConcessionalRate = 0;
        for (const [threshold, rate] of Object.entries(landConcessionalRates)) {
          if (price <= parseInt(threshold)) {
            landConcessionalRate = rate;
            break;
          }
        }
        
        // Calculate concessional duty: price * concessional rate
        return price * landConcessionalRate;
      }
      
      // For land properties $450k+: use standard stamp duty rates (no concessions)
      if (propertyCategory === 'land' && price > 450000) {
        return duty; // Return the original duty calculation (no concessions)
      }
      
      // For non-land properties under $800k: full exemption
      if (price <= 800000) {
        return 0;
      }
      if (price >= 1000000) return duty; // No concession at or above $1M
      if (price > 800000 && price < 1000000) {
        // Between $800k and $1M - use existing concessional rates
        const concessionalRates = {
          805000: 0.001224, 810000: 0.002433, 815000: 0.003627, 820000: 0.004806, 825000: 0.005972,
          830000: 0.007123, 835000: 0.008260, 840000: 0.009384, 845000: 0.010494, 850000: 0.011592,
          855000: 0.012676, 860000: 0.013748, 865000: 0.014808, 870000: 0.015855, 875000: 0.016891,
          880000: 0.017915, 885000: 0.018927, 890000: 0.019927, 895000: 0.020917, 900000: 0.021896,
          905000: 0.022863, 910000: 0.023820, 915000: 0.024767, 920000: 0.025703, 925000: 0.026630,
          930000: 0.027546, 935000: 0.028453, 940000: 0.029349, 945000: 0.030240, 950000: 0.031115,
          955000: 0.031984, 960000: 0.032843, 965000: 0.033694, 970000: 0.034536, 975000: 0.035370,
          980000: 0.036195, 985000: 0.037011, 990000: 0.037820, 995000: 0.038620, 999999: 0.039412
        };
        
        // Find the appropriate rate for the price
        let concessionalRate = 0;
        for (const [threshold, rate] of Object.entries(concessionalRates)) {
          if (price <= parseInt(threshold)) {
            concessionalRate = rate;
            break;
          }
        }
        
        // Calculate concessional duty: price * concessional rate
        return price * concessionalRate;
      }
      break;
      
    case 'VIC':
      // VIC: Exempt from stamp duty on properties up to $600,000
      // Concession available between $600,001 and $750,000
      // BUT only if BOTH first home buyer AND PPR
      if (!isPPR) return duty; // No concession if not PPR
      if (price <= 600000) return 0; // Full exemption
      if (price <= 750000) return duty * (1 - (750000 - price) / 150000); // Partial exemption
      break;
      
    case 'QLD':
      // QLD: Concessions available for PPR (Principal Place of Residence) regardless of citizenship
      if (isPPR) {
        // For new/off-the-plan properties: no stamp duty
        if (propertyType === 'new' || propertyType === 'off-the-plan') {
          return 0; // Full exemption for new/off-the-plan properties
        }
        
        // For existing properties: apply first home buyer concession if applicable
        if (isFirstHomeBuyer) {
          // First home concession: duty calculated at home concession rate minus additional concession amount
          const concessionAmount = calculateQueenslandConcession(price);
          const discountedDuty = Math.max(0, duty - concessionAmount);
          return discountedDuty;
        }
        
        // For PPR but not first home buyer: still get home concession rates (already applied above)
        return duty;
      }
      
      // For non-PPR (investment properties): no concessions
      return duty;
      break;
      
    case 'SA':
      // SA: Stamp duty relief for first home buyers on NEW homes only
      // Existing properties: full stamp duty at normal rates (no exemptions)
      if (propertyType === 'existing') {
        return duty; // Full stamp duty for existing properties
      }
      // For new/off-the-plan properties: full exemption (no price caps)
      return 0;
      break;
      
    case 'WA':
      // WA: Use the proper concession rates from constants
      if (!isPPR) return duty; // No concession if not PPR
      
      // For established homes, use the established home concession rates
      const establishedHomeRates = WA_STAMP_DUTY_CONCESSIONS.FIRST_HOME_OWNER.ESTABLISHED_HOME;
      
      // Check if price exceeds the concession caps
      const metroCap = 700000; // Metropolitan cap
      const nonMetroCap = 750000; // Non-metropolitan cap
      
      if ((waRegion === 'non-metropolitan' && price > nonMetroCap) || 
          (waRegion !== 'non-metropolitan' && price > metroCap)) {
        // Price exceeds concession caps - use standard WA stamp duty rates for entire amount
        return duty;
      }
      
      // Find the appropriate bracket based on price
      let applicableBracket = null;
      for (const bracket of establishedHomeRates) {
        if (price <= bracket.maxValue) {
          applicableBracket = bracket;
          break;
        }
      }
      
      if (!applicableBracket) {
        return duty; // No bracket found, return full duty
      }
      
      if (applicableBracket.concession === 1.0) {
        return 0; // 100% concession (no duty payable)
      }
      
      // For non-metropolitan regions, use the LOCAL bracket if available
      // Check if there's a LOCAL bracket that covers this price range
      const localBracket = establishedHomeRates.find(b => b.region === 'LOCAL' && price <= b.maxValue);
      if (waRegion === 'non-metropolitan' && localBracket && price <= localBracket.maxValue) {
        // Use the local (lower) rate
        const excessAmount = price - localBracket.minValue;
        return excessAmount * localBracket.concession;
      }
      
      // Use the metropolitan rate (higher rate) by default
      const excessAmount = price - applicableBracket.minValue;
      return excessAmount * applicableBracket.concession;
      break;
      
    case 'TAS':
      // TAS: 100% discount on property transfer duty for established homes up to $750,000
      if (price <= 750000) return 0; // Full exemption
      break;
      
    case 'ACT':
      // ACT: Full stamp duty concession for eligible applicants
      if (price <= 1000000) return 0; // Full exemption for all properties under $1M
      break;
      
    case 'NT':
      // NT: Simplified concession for established homes
      if (price < 600000) return duty * 0.5; // 50% reduction
      break;
      
    default:
      // Fallback to simplified 50% reduction for properties under $600k
      if (price < 600000) return duty * 0.5;
  }
  
  return duty;
};

// Land Transfer Fee (Land Use Victoria formula)
export const calculateLandTransferFee = (price, state) => {
  // Official government land transfer (title registration) fees - FY 2025/26
  switch (state) {
    case 'NSW':
      // NSW: Standard transfer fee ~$155 incl. GST
      return 155;
      
    case 'VIC':
      // VIC: Based on fee units ($16.81 per unit)
      // Standard transfer typically uses 6-8 fee units
      const feeUnits = 7; // Average for standard transfer
      return feeUnits * 16.81;
      
    case 'QLD':
      // QLD: Tiered by property value
      if (price <= 50000) return 200;
      if (price <= 100000) return 300;
      if (price <= 200000) return 400;
      if (price <= 350000) return 500;
      if (price <= 500000) return 600;
      if (price <= 750000) return 800;
      if (price <= 1000000) return 1000;
      if (price <= 1500000) return 1500;
      return 2000; // For properties over $1.5M
      
    case 'WA':
      // WA: $180–$400+ depending on property value
      if (price <= 80000) return 180;
      if (price <= 100000) return 200;
      if (price <= 250000) return 250;
      if (price <= 500000) return 300;
      if (price <= 1000000) return 350;
      return 400;
      
    case 'SA':
      // SA: Fixed per dealing (transfer)
      return 172; // Standard transfer fee
      
    case 'TAS':
      // TAS: ~$147–$300+ based on price tiers
      if (price <= 25000) return 147;
      if (price <= 50000) return 180;
      if (price <= 100000) return 220;
      if (price <= 200000) return 250;
      if (price <= 500000) return 280;
      return 300;
      
    case 'ACT':
      // ACT: Flat registration fee ~$409
      return 409;
      
    case 'NT':
      // NT: ~$145–$750+ based on value
      if (price <= 50000) return 145;
      if (price <= 100000) return 200;
      if (price <= 200000) return 300;
      if (price <= 500000) return 450;
      if (price <= 1000000) return 600;
      return 750;
      
    default:
      // Fallback to NSW calculation
      return 155;
  }
};

// Mortgage Registration Fee
export const calculateMortgageRegistrationFee = (hasMortgage = true) => {
  return hasMortgage ? 120 : 0;
};

// Legal/Conveyancing Fees (estimated based on property price and type)
export const calculateLegalFees = (price, propertyType = 'existing') => {
  // Base fees by property type and service type
  const baseFees = {
    'existing': {
      conveyancer: {
        low: 800,
        medium: 1000,
        high: 1500
      },
      solicitor: {
        low: 1500,
        medium: 2000,
        high: 2500
      }
    },
    'off-the-plan': {
      conveyancer: {
        low: 1200,
        medium: 1500,
        high: 2000
      },
      solicitor: {
        low: 2000,
        medium: 2500,
        high: 3000
      }
    }
  };
  
  const fees = baseFees[propertyType] || baseFees.existing;
  
  // Determine fee tier based on property price
  let feeTier;
  if (price < 500000) feeTier = 'low';
  else if (price < 1000000) feeTier = 'medium';
  else feeTier = 'high';
  
  // Return average of conveyancer and solicitor fees
  const conveyancerFee = fees.conveyancer[feeTier];
  const solicitorFee = fees.solicitor[feeTier];
  
  return Math.round((conveyancerFee + solicitorFee) / 2);
};

// Building and Pest Inspection (estimated based on property price)
export const calculateInspectionFees = (price) => {
  if (price < 500000) return 400;
  if (price < 1000000) return 600;
  return 800; // For larger/more expensive properties
};

// Lenders Mortgage Insurance (LMI) calculation
export const calculateLMI = (loanAmount, propertyPrice, upfrontCosts) => {
  // Calculate LVR including upfront costs
  const totalPropertyCost = propertyPrice + upfrontCosts;
  const lvr = (loanAmount / totalPropertyCost) * 100;
  
  // If LVR is 80% or below, no LMI required
  if (lvr <= 80) return 0;
  
  // If LVR is above 95% (deposit less than 5%), use the highest LMI rate
  let lvrBand;
  if (lvr > 95) {
    lvrBand = '94.01-95%'; // Use highest available rate
  } else if (lvr > 80 && lvr <= 81) {
    lvrBand = '80.01-81%';
  } else if (lvr > 81 && lvr <= 85) {
    lvrBand = '84.01-85%';
  } else if (lvr > 85 && lvr <= 89) {
    lvrBand = '88.01-89%';
  } else if (lvr > 89 && lvr <= 90) {
    lvrBand = '89.01-90%';
  } else if (lvr > 90 && lvr <= 91) {
    lvrBand = '90.01-91%';
  } else if (lvr > 91 && lvr <= 95) {
    lvrBand = '94.01-95%';
  } else {
    return 0; // Should not reach here
  }
  
  // Determine loan amount band
  let loanBand;
  if (loanAmount <= 300000) loanBand = '0-300K';
  else if (loanAmount <= 500000) loanBand = '300K-500K';
  else if (loanAmount <= 600000) loanBand = '500K-600K';
  else if (loanAmount <= 750000) loanBand = '600K-750K';
  else if (loanAmount <= 1000000) loanBand = '750K-1M';
  else return 0; // Loan too large for standard LMI
  
  // LMI rates table
  const lmiRates = {
    '80.01-81%': {
      '0-300K': 0.00475,
      '300K-500K': 0.00568,
      '500K-600K': 0.00904,
      '600K-750K': 0.00904,
      '750K-1M': 0.00913
    },
    '84.01-85%': {
      '0-300K': 0.00727,
      '300K-500K': 0.00969,
      '500K-600K': 0.01165,
      '600K-750K': 0.01333,
      '750K-1M': 0.01407
    },
    '88.01-89%': {
      '0-300K': 0.01295,
      '300K-500K': 0.01621,
      '500K-600K': 0.01948,
      '600K-750K': 0.02218,
      '750K-1M': 0.02395
    },
    '89.01-90%': {
      '0-300K': 0.01463,
      '300K-500K': 0.01873,
      '500K-600K': 0.02180,
      '600K-750K': 0.02367,
      '750K-1M': 0.02516
    },
    '90.01-91%': {
      '0-300K': 0.02013,
      '300K-500K': 0.02618,
      '500K-600K': 0.03513,
      '600K-750K': 0.03783,
      '750K-1M': 0.03820
    },
    '94.01-95%': {
      '0-300K': 0.02609,
      '300K-500K': 0.03345,
      '500K-600K': 0.03998,
      '600K-750K': 0.04613,
      '750K-1M': 0.04603
    }
  };
  
  const rate = lmiRates[lvrBand]?.[loanBand];
  if (!rate) return 0;
  
  return loanAmount * rate;
};

export const calculateTotalRepayments = (principal, rate, years, repaymentType = 'principal-interest') => {
  const monthlyPayment = calculateMonthlyRepayment(principal, rate, years, repaymentType);
  
  if (repaymentType.startsWith('interest-only-')) {
    const interestOnlyYears = parseInt(repaymentType.split('-')[2]);
    const remainingYears = years - interestOnlyYears;
    
    if (remainingYears <= 0) {
      // If interest-only period is longer than or equal to loan term
      return monthlyPayment * years * 12;
    } else {
      // Calculate total for interest-only period + remaining principal and interest period
      const interestOnlyPayments = monthlyPayment * interestOnlyYears * 12;
      
      // For the remaining period, calculate principal and interest payments
      const remainingMonthlyRate = rate / 100 / 12;
      const remainingPayments = remainingYears * 12;
      const remainingMonthlyPayment = (principal * remainingMonthlyRate * Math.pow(1 + remainingMonthlyRate, remainingPayments)) / 
                                     (Math.pow(1 + remainingMonthlyRate, remainingPayments) - 1);
      const remainingTotal = remainingMonthlyPayment * remainingPayments;
      
      return interestOnlyPayments + remainingTotal;
    }
  }
  
  // Principal and interest calculation (default)
  return monthlyPayment * years * 12;
};

export const calculateMonthlyRepayment = (principal, rate, years, repaymentType = 'principal-interest') => {
  const monthlyRate = rate / 100 / 12;
  
  if (monthlyRate === 0) return principal / (years * 12);
  
  // Interest only calculations
  if (repaymentType.startsWith('interest-only-')) {
    const interestOnlyYears = parseInt(repaymentType.split('-')[2]);
    const remainingYears = years - interestOnlyYears;
    
    if (remainingYears <= 0) {
      // If interest-only period is longer than or equal to loan term, calculate interest only
      return principal * monthlyRate;
    } else {
      // During interest-only period, pay only interest
      // The monthly payment is just the interest payment
      return principal * monthlyRate;
    }
  }
  
  // Principal and interest calculation (default)
  const numPayments = years * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
};

export const estimatePropertyPrice = (address, state) => {
  // Simplified price estimation based on state averages
  const basePrice = STATE_AVERAGES[state] || 700000;
  
  // Add some randomness for demonstration
  return Math.round(basePrice * (0.8 + Math.random() * 0.4));
};

export const calculateForeignBuyerDuty = (price, state, isForeignBuyer) => {
  if (!isForeignBuyer) return 0;
  return price * (FOREIGN_BUYER_RATES[state] || 0);
};

export const calculateCouncilRates = (price, state) => {
  // Council rates are typically 0.3% to 0.6% of property value annually
  // Varies by state and council area
  const rate = 0.004; // 0.4% average
  return Math.round(price * rate);
};

export const calculateWaterRates = (price, state) => {
  // Water rates are typically $800-$1500 annually
  // Based on property value and usage
  if (price < 500000) return 900;
  if (price < 1000000) return 1100;
  return 1300;
};

export const calculateBodyCorporate = (price, propertyCategory) => {
  // Body corporate fees vary significantly by property type and location
  // Default estimate based on property category
  switch (propertyCategory) {
    case 'apartment':
      return 4000; // Typical apartment strata fees
    case 'townhouse':
      return 2500; // Lower for townhouses
    case 'house':
      return 0; // Houses typically don't have body corporate
    case 'land':
      return 0; // Land doesn't have body corporate
    default:
      return 0;
  }
};

export const calculateFirstHomeOwnersGrant = (price, state, propertyType, propertyCategory, estimatedBuildCost = 0, waRegion = null, isPPR = false) => {
  const grantAmount = FIRST_HOME_OWNERS_GRANT[state] || 0;
  
  if (grantAmount === 0) return 0; // No grant available (e.g., ACT)
  
  // First Home Owners Grant requires the property to be the Principal Place of Residence
  if (!isPPR) {
    return 0;
  }
  
  // First Home Owners Grant is only available for off-the-plan properties
  if (propertyType !== 'off-the-plan') {
    return 0;
  }
  
  // Check eligibility based on state-specific rules
  switch (state) {
    case 'NSW':
      // For land: total cost must be less than $750k
      if (propertyCategory === 'land') {
        if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
          const totalCost = price + estimatedBuildCost;
          return totalCost <= 750000 ? grantAmount : 0;
        }
        return 0; // No grant if no build cost provided
      }
      // For other property types: $600k cap
      return price <= 600000 ? grantAmount : 0;
      
    case 'VIC':
      // For land: total cost must be less than $750k
      if (propertyCategory === 'land') {
        if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
          const totalCost = price + estimatedBuildCost;
          return totalCost <= 750000 ? grantAmount : 0;
        }
        return 0; // No grant if no build cost provided
      }
      // For other property types: $750k cap
      return price <= 750000 ? grantAmount : 0;
      
    case 'QLD':
      // For land: total cost must be less than or equal to $750k
      if (propertyCategory === 'land') {
        if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
          const totalCost = price + estimatedBuildCost;
          return totalCost <= 750000 ? grantAmount : 0;
        }
        return 0; // No grant if no build cost provided
      }
      // For other property types: $750k cap
      return price <= 750000 ? grantAmount : 0;
      
    case 'SA':
      // Up to $15,000 for new homes (no property value cap as of 6 Jun 2024)
      return grantAmount;
      
    case 'WA':
      // For land: total cost must be under cap based on region
      if (propertyCategory === 'land') {
        if (estimatedBuildCost !== undefined && estimatedBuildCost !== null) {
          const totalCost = price + estimatedBuildCost;
          const priceCap = waRegion === 'north' ? 1000000 : 750000; // $1M for north, $750k for south
          return totalCost <= priceCap ? grantAmount : 0;
        }
        return 0; // No grant if no build cost provided
      }
      // For other property types: cap based on region
      const priceCap = waRegion === 'north' ? 1000000 : 750000; // $1M for north, $750k for south
      return price <= priceCap ? grantAmount : 0;
      
    case 'TAS':
      // Same logic as SA but with $10,000 grant amount
      // Up to $10,000 for new homes (no property value cap)
      return grantAmount;
      
    case 'NT':
      // Same logic as SA and TAS but with $50,000 grant amount
      // Up to $50,000 for new homes (no property value cap)
      return grantAmount;
      
    case 'ACT':
      // No FHOG, replaced by Home Buyer Concession Scheme
      return 0;
      
    default:
      return 0;
  }
};

// Land Tax calculation for investor properties
export const calculateLandTax = (price, state) => {
  // Placeholder land tax calculation - simplified for now
  // In reality, land tax varies significantly by state and has different thresholds
  if (price <= 500000) return 0;
  if (price <= 1000000) return price * 0.001; // 0.1% for properties $500k-$1M
  return price * 0.002; // 0.2% for properties over $1M
};

export const getFHOGPPRRequirements = (state) => {
  const requirements = {
    'VIC': 'Must live for 12 months within 12 months of settlement',
    'NSW': 'Must live for 6 months within 12 months of settlement',
    'QLD': 'Must live for 6 months within 12 months of settlement',
    'SA': 'Must live for 6 months within 12 months of settlement',
    'WA': 'Must live for 6 months within 12 months of settlement',
    'TAS': 'Must live for 6 months within 12 months of settlement',
    'ACT': 'Must live for 12 months within 12 months of settlement',
    'NT': 'Must live for 12 months within 12 months of settlement'
  };
  
  return requirements[state] || 'PPR requirements vary by state';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}; 