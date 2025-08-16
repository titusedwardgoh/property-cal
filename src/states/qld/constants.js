// QLD-specific constants and rates
export const QLD_STAMP_DUTY_RATES = [
  { min: 0, max: 5000, rate: 0, fixedFee: 0 }, // Not more than $5,000 - Nil
  { min: 5000, max: 75000, rate: 0.015, fixedFee: 0 }, // $1.50 for each $100 over $5,000 = 1.5%
  { min: 75000, max: 540000, rate: 0.035, fixedFee: 1050 }, // $1,050 + $3.50 for each $100 over $75,000
  { min: 540000, max: 1000000, rate: 0.045, fixedFee: 17325 }, // $17,325 + $4.50 for each $100 over $540,000
  { min: 1000000, max: Infinity, rate: 0.0575, fixedFee: 38025 } // $38,025 + $5.75 for each $100 over $1,000,000
];

// QLD Home Concession rates (reduced rates for homes)
// Based on: https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/home-concession/
export const QLD_HOME_CONCESSION_RATES = [
  { min: 0, max: 350000, rate: 0.01, fixedFee: 0 }, // $1.00 per $100 = 1% on first $350,000
  { min: 350000, max: 540000, rate: 0.035, fixedFee: 3500 }, // $3,500 + $3.50 per $100 over $350,000
  { min: 540000, max: 1000000, rate: 0.045, fixedFee: 10150 }, // $10,150 + $4.50 per $100 over $540,000
  { min: 1000000, max: Infinity, rate: 0.0575, fixedFee: 30850 } // $30,850 + $5.75 per $100 over $1,000,000
];

// QLD first home buyer concession brackets (contracts signed on or after 9 June 2024)
export const QLD_FIRST_HOME_CONCESSION_BRACKETS = [
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

export const QLD_FOREIGN_BUYER_RATE = 0.07;
export const QLD_STATE_AVERAGE = 650000;
export const QLD_FIRST_HOME_OWNERS_GRANT = 30000; // $30,000 for contracts signed between 20 Nov 2023 and 30 Jun 2026
export const QLD_FHOG_PROPERTY_CAP = 750000;
export const QLD_FHOG_LAND_CAP = 750000;

// QLD-specific concessions and requirements
export const QLD_FIRST_HOME_BUYER_CONCESSION = {
  REQUIREMENTS: {
    MUST_BE_PPR: true,
    MUST_BE_FIRST_HOME_BUYER: true,
    PROPERTY_TYPE: 'existing' // Only for existing properties
  },
  NEW_OFF_PLAN_EXEMPTION: true, // New/off-the-plan properties get full exemption
  DESCRIPTION: "First home buyer concessions available for PPR properties regardless of citizenship"
};

// QLD land transfer fees (tiered by property value)
export const QLD_LAND_TRANSFER_FEES = {
  50000: 200,
  100000: 300,
  200000: 400,
  350000: 500,
  500000: 600,
  750000: 800,
  1000000: 1000,
  1500000: 1500,
  INFINITY: 2000 // For properties over $1.5M
};

// QLD PPR requirements
export const QLD_PPR_REQUIREMENT = 'Must live for 6 months within 12 months of settlement';

// QLD vacant land concession
export const QLD_VACANT_LAND_CONCESSION = {
  AVAILABLE: true,
  DESCRIPTION: "If claimed, stamp duty is $0 with no price caps for Queensland vacant land purchases",
  REQUIREMENTS: "Must be land with build cost and claimVacantLandConcession must be true"
};
