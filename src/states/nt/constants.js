// NT-specific constants and rates
// NT uses a formula-based calculation for properties up to $525,000: (0.06571441 x V²) + 15V where V = 1/1000 of property value
// For properties over $525,000, standard percentage rates apply
export const NT_STAMP_DUTY_FORMULA = {
  COEFFICIENT: 0.06571441, // Coefficient for V² term
  LINEAR_TERM: 15, // Coefficient for V term
  V_DIVISOR: 1000, // Divisor to convert property value to V
  MAX_FORMULA_VALUE: 525000 // Maximum value for formula calculation
};

// NT stamp duty rates - formula for properties up to $525,000, then percentage rates
export const NT_STAMP_DUTY_RATES = [
  { min: 0, max: 525000, rate: 'formula', description: 'Formula-based calculation: (0.06571441 × V²) + 15V' },
  { min: 525000, max: 3000000, rate: 0.0495, fixedFee: 0, description: '4.95% of dutiable value' },
  { min: 3000000, max: 5000000, rate: 0.0575, fixedFee: 0, description: '5.75% of dutiable value' },
  { min: 5000000, max: Infinity, rate: 0.0595, fixedFee: 0, description: '5.95% of dutiable value' }
];

// NT first home buyer concession brackets
export const NT_FIRST_HOME_CONCESSION_BRACKETS = [
  { min: 0, max: 500000, concession: 18500 }, // Full concession up to $500,000
  { min: 500000, max: 600000, concession: 9250 }, // $9,250 concession
  { min: 600000, max: Infinity, concession: 0 } // No concession for $600,000 or more
];

export const NT_FOREIGN_BUYER_RATE = 0.07; // 7% additional duty for foreign buyers
export const NT_STATE_AVERAGE = 500000;
export const NT_FIRST_HOME_OWNERS_GRANT = 10000; // $10,000 for eligible first home buyers
export const NT_FHOG_PROPERTY_CAP = 750000; // Cap for all property types
export const NT_FHOG_LAND_CAP = 400000; // Cap for vacant land
export const NT_FHOG_NEW_BUILD_CAP = 750000; // Cap for new builds

// NT-specific concessions and requirements
export const NT_FIRST_HOME_BUYER_CONCESSION = {
  REQUIREMENTS: {
    MUST_BE_PPR: true,
    MUST_BE_FIRST_HOME_BUYER: true,
    PROPERTY_TYPE: 'all', // Available for all property types
    MAX_PRICE: 600000
  },
  DESCRIPTION: "First home buyer concessions available for PPR properties up to $600,000"
};

// NT land transfer fees (tiered by property value)
export const NT_LAND_TRANSFER_FEES = {
  50000: 200,
  100000: 300,
  200000: 400,
  300000: 500,
  500000: 600,
  750000: 800,
  1000000: 1000,
  1500000: 1500,
  INFINITY: 2000 // For properties over $1.5M
};

// NT PPR requirements
export const NT_PPR_REQUIREMENT = 'Must live for 12 months within 12 months of settlement';

// NT vacant land concession
export const NT_VACANT_LAND_CONCESSION = {
  AVAILABLE: false,
  DESCRIPTION: "No specific vacant land concession in NT - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all property types"
};

// NT off-the-plan concession
export const NT_OFF_THE_PLAN_CONCESSION = {
  AVAILABLE: false,
  DESCRIPTION: "No specific off-the-plan concession in NT - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all property types"
};

// NT regional concessions
export const NT_REGIONAL_CONCESSIONS = {
  AVAILABLE: false,
  DESCRIPTION: "No specific regional concessions in NT - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all properties"
};

// NT home concession rates (PPR vs investment)
export const NT_HOME_CONCESSION_RATES = {
  PPR: {
    AVAILABLE: true,
    DESCRIPTION: "Standard rates apply to PPR properties",
    REQUIREMENTS: "Must be principal place of residence"
  },
  INVESTMENT: {
    AVAILABLE: false,
    DESCRIPTION: "No specific investment property concessions in NT",
    REQUIREMENTS: "Standard rates apply to investment properties"
  }
};

// NT pensioner concessions
export const NT_PENSIONER_CONCESSIONS = {
  AVAILABLE: false,
  DESCRIPTION: "No specific pensioner concessions in NT",
  REQUIREMENTS: "Standard rates apply to all properties",
  CONCESSION_AMOUNT: 0
};

// NT senior concessions
export const NT_SENIOR_CONCESSIONS = {
  AVAILABLE: false,
  DESCRIPTION: "No specific senior concessions in NT",
  REQUIREMENTS: "Standard rates apply to all properties",
  CONCESSION_AMOUNT: 0
};
