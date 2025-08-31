// VIC-specific constants and rates
export const VIC_STAMP_DUTY_RATES = [
  { min: 0, max: 25000, rate: 0.014, fixedFee: 0 },
  { min: 25000, max: 130000, rate: 0.024, fixedFee: 350 },
  { min: 130000, max: 960000, rate: 0.06, fixedFee: 2870 },
  { min: 960000, max: 2000000, rate: 0.055, fixedFee: 0 },
  { min: 2000000, max: Infinity, rate: 0.065, fixedFee: 110000 }
];

export const VIC_FOREIGN_BUYER_RATE = 0.08;

export const VIC_FHB_CONCESSIONAL_RATES = {
  600000: 0.000000, 600005: 0.000002, 605000: 0.001727, 610000: 0.003454, 615000: 0.005181,
  620000: 0.006908, 625000: 0.008635, 630000: 0.010362, 635000: 0.012089, 640000: 0.013816,
  645000: 0.015707, 650000: 0.017598, 655000: 0.019489, 660000: 0.021380, 665000: 0.023271,
  670000: 0.025162, 675000: 0.027053, 680000: 0.028944, 685000: 0.030835, 690000: 0.032726,
  695000: 0.034617, 700000: 0.035304, 705000: 0.035991, 710000: 0.036678, 715000: 0.037365,
  720000: 0.038052, 725000: 0.038739, 730000: 0.039426, 735000: 0.040113, 740000: 0.040800,
  745000: 0.041487, 749999: 0.053427, 750000: 0.053427
};

// VIC PPR Concessional Rates for Principal Place of Residence
export const VIC_PPR_CONCESSIONAL_RATES = [
  { min: 130000, max: 440000, rate: 0.05, fixedFee: 2870},
  { min: 440000, max: 550000, rate: 0.06, fixedFee: 18370}
];

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
