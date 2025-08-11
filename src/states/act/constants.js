// ACT-specific constants and rates
export const ACT_STAMP_DUTY_RATES = [
  { min: 0, max: 200000, rate: 0, fixedFee: 0 }, // $0 for properties up to $200,000
  { min: 200000, max: 300000, rate: 0.015, fixedFee: 0 }, // $1.50 per $100 = 1.5%
  { min: 300000, max: 500000, rate: 0.02, fixedFee: 1500 }, // $1,500 + $2.00 per $100 over $300,000
  { min: 500000, max: 750000, rate: 0.03, fixedFee: 5500 }, // $5,500 + $3.00 per $100 over $500,000
  { min: 750000, max: 1000000, rate: 0.04, fixedFee: 13000 }, // $13,000 + $4.00 per $100 over $750,000
  { min: 1000000, max: 1455000, rate: 0.05, fixedFee: 23000 }, // $23,000 + $5.00 per $100 over $1,000,000
  { min: 1455000, max: Infinity, rate: 0.055, fixedFee: 45500 } // $45,500 + $5.50 per $100 over $1,455,000
];

// ACT first home buyer concession brackets
export const ACT_FIRST_HOME_CONCESSION_BRACKETS = [
  { min: 0, max: 500000, concession: 100000 }, // Full concession up to $500,000
  { min: 500000, max: 600000, concession: 75000 }, // $75,000 concession
  { min: 600000, max: 700000, concession: 50000 }, // $50,000 concession
  { min: 700000, max: 800000, concession: 25000 }, // $25,000 concession
  { min: 800000, max: Infinity, concession: 0 } // No concession for $800,000 or more
];

export const ACT_FOREIGN_BUYER_RATE = 0.08; // 8% additional duty for foreign buyers
export const ACT_STATE_AVERAGE = 800000;
export const ACT_FIRST_HOME_OWNERS_GRANT = 7000; // $7,000 for eligible first home buyers
export const ACT_FHOG_PROPERTY_CAP = 750000; // Cap for all property types
export const ACT_FHOG_LAND_CAP = 400000; // Cap for vacant land
export const ACT_FHOG_NEW_BUILD_CAP = 750000; // Cap for new builds

// ACT-specific concessions and requirements
export const ACT_FIRST_HOME_BUYER_CONCESSION = {
  REQUIREMENTS: {
    MUST_BE_PPR: true,
    MUST_BE_FIRST_HOME_BUYER: true,
    PROPERTY_TYPE: 'all', // Available for all property types
    MAX_PRICE: 800000
  },
  DESCRIPTION: "First home buyer concessions available for PPR properties up to $800,000"
};

// ACT land transfer fees (tiered by property value)
export const ACT_LAND_TRANSFER_FEES = {
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

// ACT PPR requirements
export const ACT_PPR_REQUIREMENT = 'Must live for 12 months within 12 months of settlement';

// ACT vacant land concession
export const ACT_VACANT_LAND_CONCESSION = {
  AVAILABLE: false,
  DESCRIPTION: "No specific vacant land concession in ACT - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all property types"
};

// ACT off-the-plan concession
export const ACT_OFF_THE_PLAN_CONCESSION = {
  AVAILABLE: false,
  DESCRIPTION: "No specific off-the-plan concession in ACT - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all property types"
};

// ACT regional concessions
export const ACT_REGIONAL_CONCESSIONS = {
  AVAILABLE: false,
  DESCRIPTION: "No specific regional concessions in ACT - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all properties"
};

// ACT home concession rates (PPR vs investment)
export const ACT_HOME_CONCESSION_RATES = {
  PPR: {
    AVAILABLE: true,
    DESCRIPTION: "Standard rates apply to PPR properties",
    REQUIREMENTS: "Must be principal place of residence"
  },
  INVESTMENT: {
    AVAILABLE: false,
    DESCRIPTION: "No specific investment property concessions in ACT",
    REQUIREMENTS: "Standard rates apply to investment properties"
  }
};

// ACT pensioner concessions
export const ACT_PENSIONER_CONCESSIONS = {
  AVAILABLE: false,
  DESCRIPTION: "No specific pensioner concessions in ACT",
  REQUIREMENTS: "Standard rates apply to all properties",
  CONCESSION_AMOUNT: 0
};

// ACT senior concessions
export const ACT_SENIOR_CONCESSIONS = {
  AVAILABLE: false,
  DESCRIPTION: "No specific senior concessions in ACT",
  REQUIREMENTS: "Standard rates apply to all properties",
  CONCESSION_AMOUNT: 0
};
