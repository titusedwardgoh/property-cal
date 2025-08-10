// WA-specific constants and rates
export const WA_STAMP_DUTY_RATES = [
  { min: 0, max: 120000, rate: 0, fixedFee: 0 }, // $0 for properties up to $120,000
  { min: 120000, max: 150000, rate: 0.01, fixedFee: 0 }, // $1.00 per $100 = 1%
  { min: 150000, max: 360000, rate: 0.02, fixedFee: 300 }, // $300 + $2.00 per $100 over $150,000
  { min: 360000, max: 725000, rate: 0.035, fixedFee: 4500 }, // $4,500 + $3.50 per $100 over $360,000
  { min: 725000, max: 1000000, rate: 0.045, fixedFee: 17275 }, // $17,275 + $4.50 per $100 over $725,000
  { min: 1000000, max: Infinity, rate: 0.055, fixedFee: 29500 } // $29,500 + $5.50 per $100 over $1,000,000
];

// WA first home buyer concession brackets (contracts signed on or after 1 July 2024)
export const WA_FIRST_HOME_CONCESSION_BRACKETS = [
  { min: 0, max: 400000, concession: 100000 }, // Full concession up to $400,000
  { min: 400000, max: 450000, concession: 75000 }, // $75,000 concession
  { min: 450000, max: 500000, concession: 50000 }, // $50,000 concession
  { min: 500000, max: 550000, concession: 25000 }, // $25,000 concession
  { min: 550000, max: Infinity, concession: 0 } // No concession for $550,000 or more
];

export const WA_FOREIGN_BUYER_RATE = 0.07; // 7% additional duty for foreign buyers
export const WA_STATE_AVERAGE = 550000;
export const WA_FIRST_HOME_OWNERS_GRANT = 10000; // $10,000 for eligible first home buyers
export const WA_FHOG_PROPERTY_CAP = 750000; // Cap for all property types
export const WA_FHOG_LAND_CAP = 400000; // Cap for vacant land
export const WA_FHOG_NEW_BUILD_CAP = 750000; // Cap for new builds

// WA-specific concessions and requirements
export const WA_FIRST_HOME_BUYER_CONCESSION = {
  REQUIREMENTS: {
    MUST_BE_PPR: true,
    MUST_BE_FIRST_HOME_BUYER: true,
    PROPERTY_TYPE: 'all', // Available for all property types
    MAX_PRICE: 550000
  },
  DESCRIPTION: "First home buyer concessions available for PPR properties up to $550,000"
};

// WA land transfer fees (tiered by property value)
export const WA_LAND_TRANSFER_FEES = {
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

// WA PPR requirements
export const WA_PPR_REQUIREMENT = 'Must live for 6 months within 12 months of settlement';

// WA vacant land concession
export const WA_VACANT_LAND_CONCESSION = {
  AVAILABLE: false,
  DESCRIPTION: "No specific vacant land concession in WA - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all property types"
};

// WA off-the-plan concession
export const WA_OFF_THE_PLAN_CONCESSION = {
  AVAILABLE: false,
  DESCRIPTION: "No specific off-the-plan concession in WA - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all property types"
};

// WA regional concessions
export const WA_REGIONAL_CONCESSIONS = {
  AVAILABLE: true,
  DESCRIPTION: "Regional concessions available for properties outside Perth metropolitan area",
  REQUIREMENTS: "Property must be located in regional WA (outside Perth metropolitan area)",
  CONCESSION_AMOUNT: 5000 // $5,000 concession for regional properties
};

// WA home concession rates (PPR vs investment)
export const WA_HOME_CONCESSION_RATES = {
  PPR: {
    AVAILABLE: true,
    DESCRIPTION: "Standard rates apply to PPR properties",
    REQUIREMENTS: "Must be principal place of residence"
  },
  INVESTMENT: {
    AVAILABLE: false,
    DESCRIPTION: "No specific investment property concessions in WA",
    REQUIREMENTS: "Standard rates apply to investment properties"
  }
};

// WA pensioner concessions
export const WA_PENSIONER_CONCESSIONS = {
  AVAILABLE: true,
  DESCRIPTION: "Pensioner concessions available for eligible pensioners",
  REQUIREMENTS: "Must be eligible pensioner with valid concession card",
  CONCESSION_AMOUNT: 2000 // $2,000 concession for eligible pensioners
};

// WA senior concessions
export const WA_SENIOR_CONCESSIONS = {
  AVAILABLE: true,
  DESCRIPTION: "Senior concessions available for eligible seniors",
  REQUIREMENTS: "Must be 65+ years old and meet income requirements",
  CONCESSION_AMOUNT: 1500 // $1,500 concession for eligible seniors
};
