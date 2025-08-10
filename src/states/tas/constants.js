// TAS-specific constants and rates
export const TAS_STAMP_DUTY_RATES = [
  { min: 0, max: 3000, rate: 0, fixedFee: 0 }, // $0 for properties up to $3,000
  { min: 3000, max: 25000, rate: 0.01, fixedFee: 0 }, // $1.00 per $100 = 1%
  { min: 25000, max: 75000, rate: 0.02, fixedFee: 220 }, // $220 + $2.00 per $100 over $25,000
  { min: 75000, max: 200000, rate: 0.03, fixedFee: 1220 }, // $1,220 + $3.00 per $100 over $75,000
  { min: 200000, max: 375000, rate: 0.04, fixedFee: 4970 }, // $4,970 + $4.00 per $100 over $200,000
  { min: 375000, max: 725000, rate: 0.045, fixedFee: 11970 }, // $11,970 + $4.50 per $100 over $375,000
  { min: 725000, max: Infinity, rate: 0.05, fixedFee: 27720 } // $27,720 + $5.00 per $100 over $725,000
];

// TAS first home buyer concession brackets (contracts signed on or after 1 July 2024)
export const TAS_FIRST_HOME_CONCESSION_BRACKETS = [
  { min: 0, max: 500000, concession: 50000 }, // $50,000 concession up to $500,000
  { min: 500000, max: 600000, concession: 25000 }, // $25,000 concession
  { min: 600000, max: 750000, concession: 10000 }, // $10,000 concession
  { min: 750000, max: Infinity, concession: 0 } // No concession for $750,000 or more
];

export const TAS_FOREIGN_BUYER_RATE = 0.08; // 8% additional duty for foreign buyers
export const TAS_STATE_AVERAGE = 450000;
export const TAS_FIRST_HOME_OWNERS_GRANT = 30000; // $30,000 for eligible first home buyers
export const TAS_FHOG_PROPERTY_CAP = 750000; // Cap for all property types
export const TAS_FHOG_LAND_CAP = 400000; // Cap for vacant land
export const TAS_FHOG_NEW_BUILD_CAP = 750000; // Cap for new builds

// TAS-specific concessions and requirements
export const TAS_FIRST_HOME_BUYER_CONCESSION = {
  REQUIREMENTS: {
    MUST_BE_PPR: true,
    MUST_BE_FIRST_HOME_BUYER: true,
    PROPERTY_TYPE: 'all', // Available for all property types
    MAX_PRICE: 750000
  },
  DESCRIPTION: "First home buyer concessions available for PPR properties up to $750,000"
};

// TAS land transfer fees (tiered by property value)
export const TAS_LAND_TRANSFER_FEES = {
  50000: 150,
  100000: 250,
  200000: 350,
  300000: 450,
  500000: 550,
  750000: 750,
  1000000: 950,
  1500000: 1450,
  INFINITY: 1950 // For properties over $1.5M
};

// TAS PPR requirements
export const TAS_PPR_REQUIREMENT = 'Must live for 6 months within 12 months of settlement';

// TAS vacant land concession
export const TAS_VACANT_LAND_CONCESSION = {
  AVAILABLE: true,
  DESCRIPTION: "Vacant land concessions available for eligible purchases",
  REQUIREMENTS: "Must be vacant land with build cost and meet eligibility criteria",
  CONCESSION_AMOUNT: 10000 // $10,000 concession for vacant land
};

// TAS off-the-plan concession
export const TAS_OFF_THE_PLAN_CONCESSION = {
  AVAILABLE: true,
  DESCRIPTION: "Off-the-plan concessions available for eligible purchases",
  REQUIREMENTS: "Must be off-the-plan property and meet eligibility criteria",
  CONCESSION_AMOUNT: 15000 // $15,000 concession for off-the-plan properties
};

// TAS regional concessions
export const TAS_REGIONAL_CONCESSIONS = {
  AVAILABLE: true,
  DESCRIPTION: "Regional concessions available for properties outside Hobart metropolitan area",
  REQUIREMENTS: "Property must be located in regional TAS (outside Hobart metropolitan area)",
  CONCESSION_AMOUNT: 3000 // $3,000 concession for regional properties
};

// TAS home concession rates (PPR vs investment)
export const TAS_HOME_CONCESSION_RATES = {
  PPR: {
    AVAILABLE: true,
    DESCRIPTION: "Standard rates apply to PPR properties",
    REQUIREMENTS: "Must be principal place of residence"
  },
  INVESTMENT: {
    AVAILABLE: false,
    DESCRIPTION: "No specific investment property concessions in TAS",
    REQUIREMENTS: "Standard rates apply to investment properties"
  }
};

// TAS pensioner concessions
export const TAS_PENSIONER_CONCESSIONS = {
  AVAILABLE: true,
  DESCRIPTION: "Pensioner concessions available for eligible pensioners",
  REQUIREMENTS: "Must be eligible pensioner with valid concession card",
  CONCESSION_AMOUNT: 2500 // $2,500 concession for eligible pensioners
};

// TAS senior concessions
export const TAS_SENIOR_CONCESSIONS = {
  AVAILABLE: true,
  DESCRIPTION: "Senior concessions available for eligible seniors",
  REQUIREMENTS: "Must be 65+ years old and meet income requirements",
  CONCESSION_AMOUNT: 2000 // $2,000 concession for eligible seniors
};
