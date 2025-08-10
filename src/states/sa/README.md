# South Australia (SA) State Migration

## Overview
This directory contains the migrated South Australia state-specific calculations and constants, separated from the main application logic.

## Files
- `constants.js` - SA-specific constants, rates, and thresholds
- `calculations.js` - SA-specific calculation functions
- `README.md` - This documentation file

## Features Implemented

### Stamp Duty
- **Base Rates**: Progressive tiered system from $0 to 5.5%
- **First Home Buyer Concessions**: Available up to $800,000 with sliding scale
- **Property Type Handling**: Supports existing, new, and off-the-plan properties
- **PPR Requirements**: Must be principal place of residence

### First Home Owners Grant
- **Amount**: $15,000
- **Property Caps**:
  - Existing properties: $575,000
  - Vacant land: $400,000
  - New builds: $750,000
- **Requirements**: Must be PPR and first home buyer

### Land Transfer Fees
- **Tiered Structure**: Based on property value from $50k to $1.5M+
- **Progressive Fees**: $200 to $2,000 based on value brackets

### Foreign Buyer Duty
- **Rate**: 7% additional duty
- **Application**: Applied to all foreign buyer transactions

### Off-the-Plan Concessions
- **Availability**: Yes, based on construction progress
- **Implementation**: Simplified calculation (may need refinement based on actual SA rules)

## Key Differences from Other States

1. **No Vacant Land Concession**: Unlike QLD, SA has no specific vacant land stamp duty exemption
2. **First Home Buyer Concessions**: Available for all property types (not just existing)
3. **Off-the-Plan Handling**: Unique concession system based on construction progress
4. **FHOG Caps**: Different caps for different property categories

## Usage

```javascript
import { calculateSAStampDuty, calculateSAFirstHomeOwnersGrant } from './calculations.js';
import { SA_STAMP_DUTY_RATES, SA_FHOG_PROPERTY_CAP } from './constants.js';

// Calculate SA stamp duty
const duty = calculateSAStampDuty(500000, true, false, true, 'existing');

// Calculate SA FHOG
const grant = calculateSAFirstHomeOwnersGrant(500000, 'existing', 'house', 0, true);
```

## Notes
- All rates and thresholds are current as of June 2024
- First home buyer concessions apply to contracts signed on or after 15 June 2024
- Off-the-plan concession calculation is simplified and may need refinement
- PPR requirement: Must live for 6 months within 12 months of settlement
