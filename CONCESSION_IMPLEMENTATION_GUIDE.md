# Concession Implementation Guide

This guide outlines the rules, patterns, and implementation steps for adding new state-specific concessions to the Real Estate Dashboard.

## Table of Contents
1. [File Structure Overview](#file-structure-overview)
2. [Concession Function Pattern](#concession-function-pattern)
3. [Integration Steps](#integration-steps)
4. [UI Display Logic](#ui-display-logic)
5. [Priority and Conflict Resolution](#priority-and-conflict-resolution)
6. [Common Patterns](#common-patterns)

## File Structure Overview

### Core Files That Need Updates:
- `src/states/[state]/calculations.js` - Main calculation logic
- `src/states/[state]/constants.js` - Concession constants and rates
- `src/states/useStateSelector.js` - Function imports and exposure
- `src/components/UpfrontCosts.js` - UI display (usually no changes needed)

### Data Flow:
```
Form Data → useStateSelector → State Functions → Calculations → UI Display
```

## Concession Function Pattern

### Standard Function Signature:
```javascript
export const calculate[STATE][CONCESSION_NAME]Concession = (buyerData, propertyData, selectedState, stampDutyAmount) => {
  // Returns: { eligible: boolean, concessionAmount: number, reason: string, details: object }
}
```

### Required Return Object Structure:
```javascript
{
  eligible: true/false,
  concessionAmount: number,
  reason: "Human readable explanation",
  details: {
    propertyPrice: number,
    baseStampDuty: number,
    concessionalStampDuty: number,
    concessionAmount: number,
    netStampDuty: number,
    // Additional concession-specific details
  }
}
```

## Integration Steps

### 1. Add Constants (constants.js)
```javascript
// [STATE] [CONCESSION_NAME] Concession
export const [STATE]_[CONCESSION_NAME]_CONCESSION = {
  AVAILABLE: true,
  DESCRIPTION: "Description of concession",
  REQUIREMENTS: "Eligibility requirements",
  PROPERTY_PRICE_CAP: number,
  PROPERTY_TYPE_RESTRICTIONS: ['property-type'],
  FULL_CONCESSION_THRESHOLD: number,
  PARTIAL_CONCESSION_THRESHOLD: number
};

// Concessional rates if needed
export const [STATE]_[CONCESSION_NAME]_CONCESSIONAL_RATES = {
  price1: rate1,
  price2: rate2
};
```

### 2. Create Calculation Function (calculations.js)
- Import constants at top of file
- Add function following standard pattern
- Include all eligibility checks
- Implement calculation logic
- Handle special cases (off-the-plan, house-and-land)

### 3. Update calculateUpfrontCosts Function (calculations.js)
- Add new concession calculation
- Update concession priority logic
- Include in `allConcessions` object for UI display

### 4. Update useStateSelector.js
- Add import: `calculate[STATE][CONCESSION_NAME]Concession`
- Add to stateFunctions object: `calculate[STATE][CONCESSION_NAME]Concession: selectedState === '[STATE]' ? calculate[STATE][CONCESSION_NAME]Concession : null`

## UI Display Logic

### Automatic Display Features:
- Concessions appear in dropdown when eligible
- Ineligible concessions show in "State Grants and Concessions" section
- Tooltips explain eligibility reasons
- Special handling for $0 concessions with explanations

### UI Integration Points:
- `upfrontCosts.concessions` - Array of eligible concessions
- `upfrontCosts.allConcessions` - Object with all concession results
- Tooltip system for explaining $0 concessions
- Color coding (green for savings, red for ineligible)

## Priority and Conflict Resolution

### Current VIC Concession Priority:
1. **First Home Buyer + Pensioner** - Show both, apply first home buyer
2. **First Home Buyer Only** - Apply first home buyer
3. **Pensioner Only** - Apply pensioner
4. **PPR Only** - Apply PPR
5. **None** - No concessions

### Adding New Concessions:
- Determine priority order
- Update `calculateUpfrontCosts` logic
- Handle multiple eligible scenarios
- Ensure only one concession is applied (unless showing both)

## Common Patterns

### Eligibility Checks (Standard Order):
1. State validation (`selectedState !== '[STATE]'`)
2. Buyer type (`buyerType !== 'owner-occupier'`)
3. PPR requirement (`isPPR !== 'yes'`)
4. Residency status (`isAustralianResident !== 'yes'`)
5. First home buyer status (`isFirstHomeBuyer !== 'yes'`)
6. Property type restrictions
7. Property category restrictions
8. Price validation (`price <= 0`)
9. Price cap checks

### Calculation Patterns:

#### Full Concession:
```javascript
if (price <= FULL_THRESHOLD) {
  concessionAmount = stampDutyAmount;
  concessionalStampDuty = 0;
}
```

#### Partial Concession (with rates):
```javascript
else if (price <= PARTIAL_THRESHOLD) {
  // Use interpolation with concessional rates
  const sortedRates = Object.entries(CONCESSIONAL_RATES).sort(([a], [b]) => parseInt(a) - parseInt(b));
  // Interpolation logic...
  concessionalStampDuty = price * applicableRate;
  concessionAmount = Math.max(0, stampDutyAmount - concessionalStampDuty);
}
```

#### Special Cases:
```javascript
// Off-the-plan properties
if (propertyType === 'off-the-plan' || propertyType === 'house-and-land') {
  return {
    eligible: true,
    concessionAmount: 0,
    reason: 'Eligible but additional seller information required',
    details: { /* ... */ }
  };
}
```

### Property Type Handling:
- `'new'` - Newly built properties
- `'off-the-plan'` - Off-the-plan purchases
- `'house-and-land'` - House and land packages
- `'existing'` - Existing properties
- `'vacant-land-only'` - Vacant land

### Buyer Data Fields:
- `buyerType` - 'owner-occupier' or 'investor'
- `isPPR` - 'yes' or 'no'
- `isAustralianResident` - 'yes' or 'no'
- `isFirstHomeBuyer` - 'yes' or 'no'
- `hasPensionCard` - 'yes' or 'no'

### Property Data Fields:
- `propertyPrice` - String or number
- `propertyType` - Property type string
- `propertyCategory` - 'land' or 'non-land'

## Testing Checklist

### Test Scenarios:
- [ ] Property price below threshold (full concession)
- [ ] Property price between thresholds (partial concession)
- [ ] Property price above threshold (no concession)
- [ ] Invalid buyer type (not eligible)
- [ ] Invalid property type (not eligible)
- [ ] Off-the-plan properties (special case)
- [ ] Multiple eligible concessions (priority logic)
- [ ] Edge cases (exact threshold amounts)

### UI Verification:
- [ ] Concession appears in dropdown when eligible
- [ ] Ineligible concession shows in bottom section
- [ ] Tooltips work correctly
- [ ] $0 concessions have proper explanations
- [ ] Color coding is correct

## Example Implementation

### For VICTempOffThePlanConcession:

1. **Constants**: Add to `vic/constants.js`
2. **Function**: Create `calculateVICTempOffThePlanConcession` in `vic/calculations.js`
3. **Integration**: Update `calculateUpfrontCosts` in `vic/calculations.js`
4. **Exposure**: Add to `useStateSelector.js`
5. **Testing**: Verify with off-the-plan properties

The UI will automatically handle display through the existing concession system.

---

*This guide should be referenced when implementing any new state-specific concessions to ensure consistency and proper integration.*
