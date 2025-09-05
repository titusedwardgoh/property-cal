// WA-specific constants and rates
export const WA_STAMP_DUTY_RATES = [
  { min: 0, max: 120000, rate: 0.019, fixedFee: 0 }, // $1.90 per $100 = 1.9%
  { min: 120000, max: 150000, rate: 0.0285, fixedFee: 2280 }, // $2,280 + $2.85 per $100 over $120,000
  { min: 150000, max: 360000, rate: 0.038, fixedFee: 3135 }, // $3,135 + $3.80 per $100 over $150,000
  { min: 360000, max: 725000, rate: 0.0475, fixedFee: 11115 }, // $11,115 + $4.75 per $100 over $360,000
  { min: 725000, max: Infinity, rate: 0.0515, fixedFee: 28453 } // $28,453 + $5.15 per $100 over $725,000
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
export const WA_FHOG_PROPERTY_CAP_SOUTH = 750000; // $750k cap for South WA
export const WA_FHOG_PROPERTY_CAP_NORTH = 1000000; // $1M cap for North WA

