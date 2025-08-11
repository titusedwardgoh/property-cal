# Australian Capital Territory (ACT) State Calculations

This directory contains Australian Capital Territory-specific calculations and constants for the Real Estate Dashboard.

## Features

### Stamp Duty Rates
- **$0** for properties up to $200,000
- **1.5%** for properties $200,000 to $300,000
- **2.0%** for properties $300,000 to $500,000 (plus $1,500 fixed fee)
- **3.0%** for properties $500,000 to $750,000 (plus $5,500 fixed fee)
- **4.0%** for properties $750,000 to $1,000,000 (plus $13,000 fixed fee)
- **5.0%** for properties $1,000,000 to $1,455,000 (plus $23,000 fixed fee)
- **5.5%** for properties over $1,455,000 (plus $45,500 fixed fee)

### First Home Buyer Concessions
- **Full concession ($100,000)** for properties up to $500,000
- **Partial concession ($75,000)** for properties $500,000 to $600,000
- **Partial concession ($50,000)** for properties $600,000 to $700,000
- **Partial concession ($25,000)** for properties $700,000 to $800,000
- **No concession** for properties over $800,000

### First Home Owners Grant
- **$7,000** for eligible first home buyers
- Available for properties up to $750,000
- Must be principal place of residence (PPR)

### Land Transfer Fees
Tiered fee structure based on property value:
- $50,000: $200
- $100,000: $300
- $200,000: $400
- $300,000: $500
- $500,000: $600
- $750,000: $800
- $1,000,000: $1,000
- $1,500,000: $1,500
- Over $1,500,000: $2,000

### Foreign Buyer Duty
- **8%** additional duty for foreign buyers

### Available Concessions
- ✅ First Home Buyer concessions
- ❌ Regional concessions (not available in ACT)
- ❌ Pensioner concessions (not available in ACT)
- ❌ Senior concessions (not available in ACT)

### PPR Requirements
- Must live for 12 months within 12 months of settlement

### Property Type Support
- Existing properties
- New builds
- Off-the-plan properties
- Vacant land
- Investment properties (no specific concessions)

## Usage

```javascript
import { 
  calculateACTStampDuty,
  calculateACTFirstHomeOwnersGrant,
  calculateACTLandTransferFee,
  calculateACTForeignBuyerDuty,
  calculateACTTotalConcessions
} from './calculations.js';

// Calculate stamp duty for a $400,000 property
const duty = calculateACTStampDuty(400000, true, false, true);
// Returns $0 (full first home buyer concession applies)

// Calculate FHOG for a $600,000 new build
const grant = calculateACTFirstHomeOwnersGrant(600000, 'new', 'house', 0, true);
// Returns $7,000 (within cap and eligible)
```

## Notes

- ACT has a generous first home buyer concession system with multiple tiers
- No regional concessions are available (unlike WA)
- Standard land transfer fees apply to all properties
- Foreign buyer duty is 8% (higher than most other states)
- PPR requirement is 12 months (longer than most other states)
- ACT has the highest state average property price ($800,000)
- FHOG is $7,000 (lower than most other states)
