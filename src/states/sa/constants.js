// SA-specific constants and rates
export const SA_STAMP_DUTY_RATES = [
  { min: 0, max: 12000, rate: 0, fixedFee: 0 }, // $0 for properties up to $12,000
  { min: 12000, max: 30000, rate: 0.01, fixedFee: 0 }, // $1.00 per $100 = 1%
  { min: 30000, max: 50000, rate: 0.02, fixedFee: 300 }, // $300 + $2.00 per $100 over $30,000
  { min: 50000, max: 100000, rate: 0.03, fixedFee: 700 }, // $700 + $3.00 per $100 over $50,000
  { min: 100000, max: 200000, rate: 0.035, fixedFee: 2200 }, // $2,200 + $3.50 per $100 over $100,000
  { min: 200000, max: 250000, rate: 0.04, fixedFee: 5700 }, // $5,700 + $4.00 per $100 over $200,000
  { min: 250000, max: 300000, rate: 0.045, fixedFee: 7700 }, // $7,700 + $4.50 per $100 over $250,000
  { min: 300000, max: 500000, rate: 0.05, fixedFee: 9950 }, // $9,950 + $5.00 per $100 over $300,000
  { min: 500000, max: Infinity, rate: 0.055, fixedFee: 19950 } // $19,950 + $5.50 per $100 over $500,000
];

// SA first home buyer concession brackets (contracts signed on or after 15 June 2024)
export const SA_FIRST_HOME_CONCESSION_BRACKETS = [
  { min: 0, max: 650000, concession: 21000 }, // Full concession up to $650,000
  { min: 650000, max: 700000, concession: 15750 }, // $15,750 concession
  { min: 700000, max: 750000, concession: 10500 }, // $10,500 concession
  { min: 750000, max: 800000, concession: 5250 }, // $5,250 concession
  { min: 800000, max: Infinity, concession: 0 } // No concession for $800,000 or more
];

export const SA_FOREIGN_BUYER_RATE = 0.07; // 7% additional duty for foreign buyers
export const SA_STATE_AVERAGE = 600000;
export const SA_FIRST_HOME_OWNERS_GRANT = 15000; // $15,000 for eligible first home buyers
export const SA_FHOG_PROPERTY_CAP = 575000; // Cap for existing properties
export const SA_FHOG_LAND_CAP = 400000; // Cap for vacant land
export const SA_FHOG_NEW_BUILD_CAP = 750000; // Cap for new builds

// SA-specific concessions and requirements
export const SA_FIRST_HOME_BUYER_CONCESSION = {
  REQUIREMENTS: {
    MUST_BE_PPR: true,
    MUST_BE_FIRST_HOME_BUYER: true,
    PROPERTY_TYPE: 'all', // Available for all property types
    MAX_PRICE: 800000
  },
  DESCRIPTION: "First home buyer concessions available for PPR properties up to $800,000"
};

// SA land transfer fees (tiered by property value)
export const SA_LAND_TRANSFER_FEES = {
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

// SA PPR requirements
export const SA_PPR_REQUIREMENT = 'Must live for 6 months within 12 months of settlement';

// SA vacant land concession
export const SA_VACANT_LAND_CONCESSION = {
  AVAILABLE: false,
  DESCRIPTION: "No specific vacant land concession in SA - standard rates apply",
  REQUIREMENTS: "Standard stamp duty rates apply to all property types"
};

// SA off-the-plan concession
export const SA_OFF_THE_PLAN_CONCESSION = {
  AVAILABLE: true,
  DESCRIPTION: "Off-the-plan properties get stamp duty concession based on construction progress",
  REQUIREMENTS: "Must be off-the-plan property with construction progress certificate"
};
