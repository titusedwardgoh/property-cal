import { STAMP_DUTY_RATES, FOREIGN_BUYER_RATES, STATE_AVERAGES } from '../data/constants.js';

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
      if (price <= 650000) return 0; // Full exemption
      if (price <= 800000) return duty * (1 - (800000 - price) / 150000); // Partial exemption
      break;
      
    case 'VIC':
      if (price <= 600000) return 0; // Full exemption
      if (price <= 750000) return duty * (1 - (750000 - price) / 150000); // Partial exemption
      break;
      
    case 'QLD':
      if (price <= 500000) return 0; // Full exemption
      if (price <= 550000) return duty * (1 - (550000 - price) / 50000); // Partial exemption
      break;
      
    case 'SA':
      if (price <= 650000) return 0; // Full exemption
      if (price <= 700000) return duty * (1 - (700000 - price) / 50000); // Partial exemption
      break;
      
    case 'WA':
      if (price <= 430000) return 0; // Full exemption
      if (price <= 530000) return duty * (1 - (530000 - price) / 100000); // Partial exemption
      break;
      
    case 'TAS':
      if (price <= 600000) return 0; // Full exemption
      if (price <= 750000) return duty * (1 - (750000 - price) / 150000); // Partial exemption
      break;
      
    case 'ACT':
      if (price <= 1000000) return 0; // Full exemption for all properties under $1M
      break;
      
    case 'NT':
      // NT has different rules - simplified for now
      if (price <= 500000) return duty * 0.5; // 50% reduction
      break;
      
    default:
      // Fallback to simplified 50% reduction for properties under $600k
      if (price < 600000) return duty * 0.5;
  }
  
  return duty;
};

// Land Transfer Fee (Land Use Victoria formula)
export const calculateLandTransferFee = (price) => {
  // Formula: $89.50 + $2.34 per $1,000 of purchase price
  return 89.50 + (price / 1000) * 2.34;
};

// Mortgage Registration Fee
export const calculateMortgageRegistrationFee = (hasMortgage = true) => {
  return hasMortgage ? 120 : 0;
};

// Legal/Conveyancing Fees (estimated based on property price)
export const calculateLegalFees = (price) => {
  if (price < 500000) return 800;
  if (price < 1000000) return 1500;
  return 2200; // For properties over $1M
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
  
  // Determine LVR band
  let lvrBand;
  if (lvr <= 81) lvrBand = '80.01-81%';
  else if (lvr <= 85) lvrBand = '84.01-85%';
  else if (lvr <= 89) lvrBand = '88.01-89%';
  else if (lvr <= 90) lvrBand = '89.01-90%';
  else if (lvr <= 91) lvrBand = '90.01-91%';
  else if (lvr <= 95) lvrBand = '94.01-95%';
  else return 0; // LVR too high, no standard LMI available
  
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

export const calculateMonthlyRepayment = (principal, rate, years) => {
  const monthlyRate = rate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
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

export const calculateCouncilRates = (price) => {
  // Estimated council rates (varies by location, simplified calculation)
  return price * 0.001; // Roughly 0.1% of property value annually
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}; 