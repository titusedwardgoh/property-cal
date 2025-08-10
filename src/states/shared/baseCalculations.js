// Common calculation functions shared across all states

// Monthly repayment calculation
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

// Total repayments calculation
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

// LMI calculation
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

// Common fee calculations
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

export const calculateInspectionFees = (price) => {
  if (price < 500000) return 400;
  if (price < 1000000) return 600;
  return 800; // For larger/more expensive properties
};

export const calculateCouncilRates = (price) => {
  // Council rates are typically 0.3% to 0.6% of property value annually
  // Varies by state and council area
  const rate = 0.004; // 0.4% average
  return Math.round(price * rate);
};

export const calculateWaterRates = (price) => {
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

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const estimatePropertyPrice = (address, state, stateAverages) => {
  // Simplified price estimation based on state averages
  const basePrice = stateAverages[state] || 700000;
  
  // Add some randomness for demonstration
  return Math.round(basePrice * (0.8 + Math.random() * 0.4));
};
