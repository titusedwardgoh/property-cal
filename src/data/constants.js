export const STAMP_DUTY_RATES = {
  NSW: [
    { min: 0, max: 14000, rate: 0.0125 },
    { min: 14000, max: 32000, rate: 0.015 },
    { min: 32000, max: 85000, rate: 0.0175 },
    { min: 85000, max: 319000, rate: 0.035 },
    { min: 319000, max: 1064000, rate: 0.045 },
    { min: 1064000, max: Infinity, rate: 0.055 }
  ],
  VIC: [
    { min: 0, max: 25000, rate: 0.014 },
    { min: 25000, max: 130000, rate: 0.024 },
    { min: 130000, max: 440000, rate: 0.05 },
    { min: 440000, max: Infinity, rate: 0.06 }
  ],
  QLD: [
    { min: 0, max: 5000, rate: 0 },
    { min: 5000, max: 75000, rate: 0.015 },
    { min: 75000, max: 540000, rate: 0.035 },
    { min: 540000, max: 1000000, rate: 0.045 },
    { min: 1000000, max: Infinity, rate: 0.0575 }
  ]
};

export const FOREIGN_BUYER_RATES = {
  NSW: 0.08,
  VIC: 0.08,
  QLD: 0.07,
  SA: 0.07,
  WA: 0.07,
  TAS: 0.03,
  NT: 0,
  ACT: 0.075
};

export const STATE_OPTIONS = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'ACT', label: 'Australian Capital Territory' }
];

export const STATE_AVERAGES = {
  NSW: 1200000,
  VIC: 900000,
  QLD: 650000,
  SA: 550000,
  WA: 600000,
  TAS: 450000,
  NT: 500000,
  ACT: 800000
};

// First Home Owners Grant amounts by state (as of 2025)
export const FIRST_HOME_OWNERS_GRANT = {
  NSW: 10000, // $10,000 for new homes up to $600,000 or $750,000 if building
  VIC: 10000, // $10,000 for new homes up to $750,000
  QLD: 30000, // $30,000 for contracts signed between 20 Nov 2023 and 30 Jun 2026
  SA: 15000,  // Up to $15,000 for new homes (no property value cap as of 6 Jun 2024)
  WA: 10000,  // $10,000 for new homes up to $750,000 (south) or $1M (north)
  TAS: 10000, // $10,000 for new homes or off-the-plan properties
  NT: 50000,  // $50,000 for new homes (HomeGrown Territory Grant)
  ACT: 0      // No FHOG, replaced by Home Buyer Concession Scheme (full stamp duty concession)
}; 