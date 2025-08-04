import { STAMP_DUTY_RATES, FOREIGN_BUYER_RATES, STATE_AVERAGES, FIRST_HOME_OWNERS_GRANT } from '../data/constants.js';

export const calculateStampDuty = (price, state, isFirstHomeBuyer = false) => {
  const rates = STAMP_DUTY_RATES[state] || STAMP_DUTY_RATES.NSW;
  let duty = 0;
  let remaining = price;

  for (const bracket of rates) {
    if (remaining <= 0) break;
    
    const taxableAmount = Math.min(remaining, bracket.max - bracket.min);
    duty += taxableAmount * bracket.rate;
    remaining -= taxableAmount;
  }

  // First home buyer concessions (state-specific)
  if (isFirstHomeBuyer) {
    duty = applyFirstHomeBuyerConcession(duty, price, state);
  }

  return duty;
};

const applyFirstHomeBuyerConcession = (duty, price, state) => {
  switch (state) {
    case 'NSW':
      // NSW: Exempt from transfer duty on new and existing homes up to $800,000
      // Concessions apply between $800,000 and $1,000,000
      if (price <= 800000) return 0; // Full exemption
      if (price <= 1000000) return duty * (1 - (1000000 - price) / 200000); // Partial exemption
      break;
      
    case 'VIC':
      // VIC: Exempt from stamp duty on properties up to $600,000
      // Concession available between $600,001 and $750,000
      if (price <= 600000) return 0; // Full exemption
      if (price <= 750000) return duty * (1 - (750000 - price) / 150000); // Partial exemption
      break;
      
    case 'QLD':
      // QLD: Full transfer duty concession for new homes
      // No specific price cap mentioned in current info, using previous logic
      if (price <= 500000) return 0; // Full exemption
      if (price <= 550000) return duty * (1 - (550000 - price) / 50000); // Partial exemption
      break;
      
    case 'SA':
      // SA: Stamp duty relief for first home buyers on eligible new homes
      // No specific price cap mentioned in current info, using previous logic
      if (price <= 650000) return 0; // Full exemption
      if (price <= 700000) return duty * (1 - (700000 - price) / 50000); // Partial exemption
      break;
      
    case 'WA':
      // WA: Stamp duty concessions up to $700,000 (Perth Metro/Peel) or $750,000 (outside)
      // Using $700,000 as default for calculations
      if (price <= 700000) return 0; // Full exemption
      if (price <= 750000) return duty * (1 - (750000 - price) / 50000); // Partial exemption
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

export const calculateFirstHomeOwnersGrant = (price, state) => {
  const grantAmount = FIRST_HOME_OWNERS_GRANT[state] || 0;
  
  if (grantAmount === 0) return 0; // No grant available (e.g., ACT)
  
  // Check eligibility based on state-specific rules
  switch (state) {
    case 'NSW':
      // $10,000 for new homes up to $600,000 or $750,000 if building
      return price <= 750000 ? grantAmount : 0;
      
    case 'VIC':
      // $10,000 for new homes up to $750,000
      return price <= 750000 ? grantAmount : 0;
      
    case 'QLD':
      // $30,000 for contracts signed between 20 Nov 2023 and 30 Jun 2026
      // For new homes up to $750,000
      return price <= 750000 ? grantAmount : 0;
      
    case 'SA':
      // Up to $15,000 for new homes (no property value cap as of 6 Jun 2024)
      return grantAmount;
      
    case 'WA':
      // $10,000 for new homes up to $750,000 (south) or $1M (north)
      // Using $750,000 as default threshold
      return price <= 750000 ? grantAmount : 0;
      
    case 'TAS':
      // $10,000 for new homes or off-the-plan properties
      return grantAmount;
      
    case 'NT':
      // $50,000 for new homes (HomeGrown Territory Grant)
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

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}; 