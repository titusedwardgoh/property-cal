# State-Based Architecture

This directory contains a refactored, state-based approach to organizing real estate calculations and constants.

## Structure

```
src/states/
├── nsw/                    # New South Wales specific
│   ├── constants.js       # NSW rates, caps, concessions
│   └── calculations.js    # NSW-specific calculation logic
├── vic/                    # Victoria specific
│   ├── constants.js       # VIC rates, caps, concessions
│   └── calculations.js    # VIC-specific calculation logic
├── shared/                # Common functionality
│   ├── commonConstants.js # Shared constants (STATE_OPTIONS, etc.)
│   └── baseCalculations.js # Common calculation functions
├── useStateSelector.js    # Hook to dynamically load state data
└── README.md             # This file
```

## How It Works

### 1. State-Specific Files
Each state (NSW, VIC, QLD, etc.) has its own directory with:
- **constants.js**: State-specific rates, caps, and rules
- **calculations.js**: State-specific calculation logic
- **test.js**: Tests to verify calculations work correctly

### 2. Shared Files
Common functionality that doesn't vary by state:
- **commonConstants.js**: STATE_OPTIONS, STATE_AVERAGES, PPR_REQUIREMENTS
- **baseCalculations.js**: calculateMonthlyRepayment, calculateLMI, etc.

### 3. State Selector Hook
The `useStateSelector` hook dynamically loads the appropriate state's data based on the selected state.

## Usage

### In Your Components/Hooks

```javascript
import { useStateSelector } from '../states/useStateSelector';

function MyComponent() {
  const { stateFunctions, stateConstants, isLoading } = useStateSelector('NSW');
  
  if (isLoading) return <div>Loading...</div>;
  
  // Use state-specific functions
  const stampDuty = stateFunctions.calculateStampDuty(
    500000, true, false, true, 'existing', 'house'
  );
  
  // Use state-specific constants
  const stateAverage = stateConstants.stateAverage;
  
  return <div>...</div>;
}
```

### Available Functions

Each state provides these functions:
- `calculateStampDuty(price, isFirstHomeBuyer, isInvestor, isPPR, propertyType, propertyCategory)`
- `calculateFirstHomeOwnersGrant(price, propertyType, propertyCategory, estimatedBuildCost, isPPR)`
- `calculateLandTransferFee()`
- `calculateForeignBuyerDuty(price, isForeignBuyer)`

Plus all shared functions like `calculateMonthlyRepayment`, `calculateLMI`, etc.

## Benefits

1. **Easier Maintenance**: Update NSW rates without touching other states
2. **Better Organization**: Each state's rules are self-contained
3. **Easier Testing**: Test NSW logic independently
4. **Scalability**: Add new states without cluttering existing code
5. **Clearer Logic**: State-specific quirks are isolated

## Adding New States

To add a new state (e.g., VIC):

1. Create `src/states/vic/` directory
2. Create `vic/constants.js` with VIC-specific rates
3. Create `vic/calculations.js` with VIC-specific logic
4. Add VIC case to `useStateSelector.js`
5. Test thoroughly

## Migration Strategy

This refactor is designed to work alongside your existing code:

1. **Phase 1**: NSW is fully extracted and tested ✅
2. **Phase 2**: Gradually extract other states
3. **Phase 3**: Update components to use `useStateSelector`
4. **Phase 4**: Remove old constants/calculations files

## Testing

Run the test files to verify calculations work correctly:

```javascript
// In browser console or test environment
import './nsw/test.js';
```

## Current Status

- ✅ NSW fully extracted and tested
- ✅ VIC fully extracted and implemented
- 🔄 Other states still use old system (fallback to NSW)
- 🔄 Components still use old imports (no breaking changes yet)

## Next Steps

1. Test NSW and VIC calculations thoroughly
2. Extract QLD next
3. Gradually migrate components to use `useStateSelector`
4. Add more states as needed
