// VIC-specific constants and rates
export const VIC_STAMP_DUTY_RATES = [
  { min: 0, max: 25000, rate: 0.014, fixedFee: 0 },
  { min: 25000, max: 130000, rate: 0.024, fixedFee: 350 },
  { min: 130000, max: 960000, rate: 0.06, fixedFee: 2870 },
  { min: 960000, max: 2000000, rate: 0.055, fixedFee: 0 },
  { min: 2000000, max: Infinity, rate: 0.065, fixedFee: 110000 }
];

export const VIC_FOREIGN_BUYER_RATE = 0.08;
export const VIC_STATE_AVERAGE = 900000;
export const VIC_FIRST_HOME_OWNERS_GRANT = 10000;
export const VIC_FHOG_PROPERTY_CAP = 750000;
export const VIC_FHOG_LAND_CAP = 750000;

// VIC-specific concessions and requirements
export const VIC_FIRST_HOME_BUYER_CONCESSION = {
  EXEMPTION_THRESHOLD: 600000,
  PARTIAL_CONCESSION_THRESHOLD: 750000,
  REQUIREMENTS: {
    MUST_BE_PPR: true,
    MUST_BE_FIRST_HOME_BUYER: true
  }
};

// VIC-specific fees
export const VIC_LAND_TRANSFER_FEE_UNIT = 16.81;
export const VIC_STANDARD_TRANSFER_FEE_UNITS = 7; // Average for standard transfer

// VIC PPR requirements
export const VIC_PPR_REQUIREMENT = 'Must live for 12 months within 12 months of settlement';
