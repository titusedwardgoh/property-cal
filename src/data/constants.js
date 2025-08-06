export const STAMP_DUTY_RATES = {
  NSW: [
    { min: 0, max: 17000, rate: 0.0125, fixedFee: 20 },
    { min: 17000, max: 37000, rate: 0.015, fixedFee: 212 },
    { min: 37000, max: 99000, rate: 0.0175, fixedFee: 512 },
    { min: 99000, max: 372000, rate: 0.035, fixedFee: 1597 },
    { min: 372000, max: 1240000, rate: 0.045, fixedFee: 11152 },
    { min: 1240000, max: Infinity, rate: 0.055, fixedFee: 50212 }
  ],
  VIC: [
    { min: 0, max: 25000, rate: 0.014, fixedFee: 0 },
    { min: 25000, max: 130000, rate: 0.024, fixedFee: 350 },
    { min: 130000, max: 960000, rate: 0.06, fixedFee: 2870 },
    { min: 960000, max: 2000000, rate: 0.055, fixedFee: 0 },
    { min: 2000000, max: Infinity, rate: 0.065, fixedFee: 110000 }
  ],
  QLD: [
    { min: 0, max: 5000, rate: 0, fixedFee: 0 },
    { min: 5000, max: 75000, rate: 0.015, fixedFee: 0 }, // $1.50 per $100 = 1.5%
    { min: 75000, max: 540000, rate: 0.035, fixedFee: 1050 }, // $3.50 per $100 = 3.5%
    { min: 540000, max: 1000000, rate: 0.045, fixedFee: 17325 }, // $4.50 per $100 = 4.5%
    { min: 1000000, max: Infinity, rate: 0.0575, fixedFee: 38025 } // $5.75 per $100 = 5.75%
  ],
  WA: [
    { min: 0, max: 120000, rate: 0.019, fixedFee: 0 }, // $1.90 per $100 = 1.9%
    { min: 120000, max: 150000, rate: 0.0285, fixedFee: 2280 }, // $2.85 per $100 = 2.85%
    { min: 150000, max: 360000, rate: 0.038, fixedFee: 3135 }, // $3.80 per $100 = 3.8%
    { min: 360000, max: 725000, rate: 0.0475, fixedFee: 11115 }, // $4.75 per $100 = 4.75%
    { min: 725000, max: Infinity, rate: 0.0515, fixedFee: 28453 } // $5.15 per $100 = 5.15%
  ],
  SA: [
    { min: 0, max: 12000, rate: 0.01, fixedFee: 0 }, // $1.00 per $100 = 1%
    { min: 12000, max: 30000, rate: 0.02, fixedFee: 120 }, // $2.00 per $100 = 2%
    { min: 30000, max: 50000, rate: 0.03, fixedFee: 480 }, // $3.00 per $100 = 3%
    { min: 50000, max: 100000, rate: 0.035, fixedFee: 1080 }, // $3.50 per $100 = 3.5%
    { min: 100000, max: 200000, rate: 0.04, fixedFee: 2830 }, // $4.00 per $100 = 4%
    { min: 200000, max: 250000, rate: 0.0425, fixedFee: 6830 }, // $4.25 per $100 = 4.25%
    { min: 250000, max: 300000, rate: 0.0475, fixedFee: 8955 }, // $4.75 per $100 = 4.75%
    { min: 300000, max: 500000, rate: 0.05, fixedFee: 11330 }, // $5.00 per $100 = 5%
    { min: 500000, max: Infinity, rate: 0.055, fixedFee: 21330 } // $5.50 per $100 = 5.5%
  ],
  TAS: [
    { min: 0, max: 3000, rate: 0, fixedFee: 50 }, // $50 flat fee
    { min: 3000, max: 25000, rate: 0.0175, fixedFee: 50 }, // $1.75 per $100 = 1.75%
    { min: 25000, max: 75000, rate: 0.0225, fixedFee: 435 }, // $2.25 per $100 = 2.25%
    { min: 75000, max: 200000, rate: 0.035, fixedFee: 1560 }, // $3.50 per $100 = 3.5%
    { min: 200000, max: 375000, rate: 0.04, fixedFee: 5935 }, // $4.00 per $100 = 4%
    { min: 375000, max: 725000, rate: 0.0425, fixedFee: 12935 }, // $4.25 per $100 = 4.25%
    { min: 725000, max: Infinity, rate: 0.045, fixedFee: 27810 } // $4.50 per $100 = 4.5%
  ],
  ACT: [
    { min: 0, max: 200000, rate: 0.02, fixedFee: 0 },
    { min: 200000, max: 300000, rate: 0.025, fixedFee: 0 },
    { min: 300000, max: 500000, rate: 0.03, fixedFee: 0 },
    { min: 500000, max: 750000, rate: 0.035, fixedFee: 0 },
    { min: 750000, max: 1000000, rate: 0.04, fixedFee: 0 },
    { min: 1000000, max: 1455000, rate: 0.054, fixedFee: 0 },
    { min: 1455000, max: Infinity, rate: 0.0454, fixedFee: 0 }
  ],
  NT: [
    { min: 0, max: 525000, rate: 0.06571441, fixedFee: 0 }, // Special formula: (0.06571441 × V²) + 15 × V, where V = dutiable value ÷ 1,000
    { min: 525001, max: 2999999, rate: 0.0495, fixedFee: 0 }, // 4.95% of dutiable value
    { min: 3000000, max: 4999999, rate: 0.0575, fixedFee: 0 }, // 5.75% of dutiable value
    { min: 5000000, max: Infinity, rate: 0.0595, fixedFee: 0 } // 5.95% of dutiable value
  ]
};

// ACT has different rates for owner occupiers vs investors
export const ACT_OWNER_OCCUPIER_RATES = [
  { min: 0, max: 260000, rate: 0.0028, fixedFee: 0 }, // $0.28 per $100 = 0.28%
  { min: 260001, max: 300000, rate: 0.022, fixedFee: 728 }, // $2.20 per $100 = 2.2%
  { min: 300001, max: 500000, rate: 0.034, fixedFee: 1608 }, // $3.40 per $100 = 3.4%
  { min: 500001, max: 750000, rate: 0.0432, fixedFee: 8408 }, // $4.32 per $100 = 4.32%
  { min: 750001, max: 1000000, rate: 0.059, fixedFee: 19208 }, // $5.90 per $100 = 5.9%
  { min: 1000001, max: 1455000, rate: 0.064, fixedFee: 33958 }, // $6.40 per $100 = 6.4%
  { min: 1455001, max: Infinity, rate: 0.0454, fixedFee: 0 } // Flat rate 4.54%
];

export const ACT_INVESTOR_RATES = [
  { min: 0, max: 200000, rate: 0.012, fixedFee: 0 }, // $1.20 per $100 = 1.2%
  { min: 200001, max: 300000, rate: 0.022, fixedFee: 2400 }, // $2.20 per $100 = 2.2%
  { min: 300001, max: 500000, rate: 0.034, fixedFee: 4600 }, // $3.40 per $100 = 3.4%
  { min: 500001, max: 750000, rate: 0.0432, fixedFee: 11400 }, // $4.32 per $100 = 4.32%
  { min: 750001, max: 1000000, rate: 0.059, fixedFee: 22200 }, // $5.90 per $100 = 5.9%
  { min: 1000001, max: 1455000, rate: 0.064, fixedFee: 36950 }, // $6.40 per $100 = 6.4%
  { min: 1455001, max: Infinity, rate: 0.0454, fixedFee: 0 } // Flat rate 4.54%
];

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