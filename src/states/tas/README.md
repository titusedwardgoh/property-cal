# Tasmania (TAS) State Migration

## Overview
This directory contains the migrated Tasmania state-specific calculations and constants, separated from the main application logic.

## Files
- `constants.js` - TAS-specific constants, rates, and thresholds
- `calculations.js` - TAS-specific calculation functions
- `README.md` - This documentation file

## Features Implemented

### Stamp Duty
- **Base Rates**: Progressive tiered system from $0 to 5.0%
- **First Home Buyer Concessions**: Available up to $750,000 with sliding scale
- **Vacant Land Concessions**: $10,000 concession for eligible vacant land purchases
- **Off-the-Plan Concessions**: $15,000 concession for eligible off-the-plan properties
- **Regional Concessions**: $3,000 concession for properties outside Hobart metropolitan area
- **Property Type Handling**: Supports all property types
- **PPR Requirements**: Must be principal place of residence

### First Home Owners Grant
- **Amount**: $30,000
- **Property Caps**:
  - All property types: $750,000
  - Vacant land: $400,000
  - New builds: $750,000
- **Requirements**: Must be PPR and first home buyer

### Land Transfer Fees
- **Tiered Structure**: Based on property value from $50k to $1.5M+
- **Progressive Fees**: $150 to $1,950 based on value brackets

### Foreign Buyer Duty
- **Rate**: 8% additional duty
- **Application**: Applied to all foreign buyer transactions

### Vacant Land Concessions
- **Availability**: Yes, for eligible vacant land purchases
- **Amount**: $10,000 concession
- **Requirements**: Must be vacant land with build cost and meet eligibility criteria

### Off-the-Plan Concessions
- **Availability**: Yes, for eligible off-the-plan properties
- **Amount**: $15,000 concession
- **Requirements**: Must be off-the-plan property and meet eligibility criteria

### Regional Concessions
- **Availability**: Yes, for properties outside Hobart metropolitan area
- **Amount**: $3,000 concession
- **Requirements**: Property must be located in regional TAS

### Pensioner Concessions
- **Availability**: Yes, for eligible pensioners
- **Amount**: $2,500 concession
- **Requirements**: Must be eligible pensioner with valid concession card

### Senior Concessions
- **Availability**: Yes, for eligible seniors
- **Amount**: $2,000 concession
- **Requirements**: Must be 65+ years old and meet income requirements

## Key Differences from Other States

1. **Generous First Home Buyer Concessions**: Up to $50,000 concession for properties under $500,000
2. **Vacant Land Concessions**: $10,000 concession for eligible vacant land purchases
3. **Off-the-Plan Concessions**: $15,000 concession for eligible off-the-plan properties
4. **Regional Concessions**: $3,000 concession for properties outside Hobart metropolitan area
5. **Higher Foreign Buyer Rate**: 8% additional duty (vs 7% in other states)
6. **Lower Stamp Duty Threshold**: $0 duty for properties up to $3,000 (vs $12,000 in WA, $120,000 in SA)

## Usage

```javascript
import { calculateTASStampDuty, calculateTASFirstHomeOwnersGrant } from './calculations.js';
import { TAS_STAMP_DUTY_RATES, TAS_FHOG_PROPERTY_CAP } from './constants.js';

// Calculate TAS stamp duty with regional concession
const duty = calculateTASStampDuty(500000, true, false, true, 'existing', false, null, true);

// Calculate TAS FHOG
const grant = calculateTASFirstHomeOwnersGrant(500000, 'existing', 'house', 0, true);

// Calculate total TAS concessions
const totalConcessions = calculateTASTotalConcessions(500000, true, true, true, false, null, 'existing');

// Calculate comprehensive TAS concessions (all types)
const comprehensiveConcessions = calculateTASComprehensiveConcessions(500000, true, true, true, false, null, 'existing', false, true);

// Calculate individual concession types
const vacantLandConcession = calculateTASVacantLandConcession(500000, true, 'land');
const offThePlanConcession = calculateTASOffThePlanConcession(500000, 'off-the-plan');
const regionalConcession = calculateTASRegionalConcession(500000, true);
const pensionerConcession = calculateTASPensionerConcession(500000, true);
const seniorConcession = calculateTASSeniorConcession(500000, true);
```

## Notes
- All rates and thresholds are current as of July 2024
- First home buyer concessions apply to contracts signed on or after 1 July 2024
- Vacant land concessions are unique to TAS and apply to eligible vacant land purchases
- Off-the-plan concessions are unique to TAS and apply to eligible off-the-plan properties
- Regional concessions apply to properties outside Hobart metropolitan area
- PPR requirement: Must live for 6 months within 12 months of settlement
- TAS has the highest foreign buyer duty rate among all states at 8%
