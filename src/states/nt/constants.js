// NT-specific constants and rates
export const NT_STAMP_DUTY_RATES = [
  { min: 0, max: 260000, rate: 0, fixedFee: 0 }, // $0 for properties up to $260,000
  { min: 260000, max: 500000, rate: 0.015, fixedFee: 0 }, // $1.50 per $100 = 1.5%
  { min: 500000, max: 1000000, rate: 0.025, fixedFee: 3600 }, // $3,600 + $2.50 per $100 over $500,000
  { min: 1000000, max: 2000000, rate: 0.035, fixedFee: 16100 }, // $16,100 + $3.50 per $100 over $1,000,000
  { min: 2000000, max: Infinity, rate: 0.045, fixedFee: 51100 } // $51,100 + $4.50 per $100 over $2,000,000
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
