# Western Australia (WA) State Migration

## Overview
This directory contains the migrated Western Australia state-specific calculations and constants, separated from the main application logic.

## Files
- `constants.js` - WA-specific constants, rates, and thresholds
- `calculations.js` - WA-specific calculation functions
- `README.md` - This documentation file

## Features Implemented

### Stamp Duty
- **Base Rates**: Progressive tiered system from $0 to 5.5%
- **First Home Buyer Concessions**: Available up to $550,000 with sliding scale
- **Regional Concessions**: $5,000 concession for properties outside Perth metropolitan area
- **Property Type Handling**: Supports all property types
- **PPR Requirements**: Must be principal place of residence

### First Home Owners Grant
- **Amount**: $10,000
- **Property Caps**:
  - All property types: $750,000
  - Vacant land: $400,000
  - New builds: $750,000
- **Requirements**: Must be PPR and first home buyer

### Land Transfer Fees
- **Tiered Structure**: Based on property value from $50k to $1.5M+
- **Progressive Fees**: $200 to $2,000 based on value brackets

### Foreign Buyer Duty
- **Rate**: 7% additional duty
- **Application**: Applied to all foreign buyer transactions

### Regional Concessions
- **Availability**: Yes, for properties outside Perth metropolitan area
- **Amount**: $5,000 concession
- **Requirements**: Property must be located in regional WA

### Pensioner Concessions
- **Availability**: Yes, for eligible pensioners
- **Amount**: $2,000 concession
- **Requirements**: Must be eligible pensioner with valid concession card

### Senior Concessions
- **Availability**: Yes, for eligible seniors
- **Amount**: $1,500 concession
- **Requirements**: Must be 65+ years old and meet income requirements

## Key Differences from Other States

1. **Generous First Home Buyer Concessions**: Up to $100,000 concession for properties under $400,000
2. **Regional Concessions**: Unique $5,000 concession for regional properties
3. **No Off-the-Plan Concessions**: Unlike SA, WA has no specific off-the-plan concessions
4. **No Vacant Land Concessions**: Standard rates apply to all property types
5. **Higher Stamp Duty Threshold**: $0 duty for properties up to $120,000 (vs $12,000 in SA)

## Usage

```javascript
import { calculateWAStampDuty, calculateWAFirstHomeOwnersGrant } from './calculations.js';
import { WA_STAMP_DUTY_RATES, WA_FHOG_PROPERTY_CAP } from './constants.js';

// Calculate WA stamp duty with regional concession
const duty = calculateWAStampDuty(500000, true, false, true, 'existing', false, null, true);

// Calculate WA FHOG
const grant = calculateWAFirstHomeOwnersGrant(500000, 'existing', 'house', 0, true);

// Calculate total WA concessions
const totalConcessions = calculateWATotalConcessions(500000, true, true, true);

// Calculate comprehensive WA concessions (all types)
const comprehensiveConcessions = calculateWAComprehensiveConcessions(500000, true, true, true, false, true);

// Calculate individual concession types
const pensionerConcession = calculateWAPensionerConcession(500000, true);
const seniorConcession = calculateWASeniorConcession(500000, true);
```

## Notes
- All rates and thresholds are current as of July 2024
- First home buyer concessions apply to contracts signed on or after 1 July 2024
- Regional concessions are unique to WA and apply to properties outside Perth metropolitan area
- PPR requirement: Must live for 6 months within 12 months of settlement
- WA has the most generous first home buyer concessions among all states
