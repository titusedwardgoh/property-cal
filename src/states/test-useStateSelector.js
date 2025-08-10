// Test the useStateSelector hook with NSW and VIC
import { useStateSelector } from './useStateSelector.js';

console.log('🧪 TESTING useStateSelector HOOK\n');

// Test NSW state selection
console.log('=== TESTING NSW STATE ===');
const nswData = useStateSelector('NSW');
console.log('NSW State Functions:', Object.keys(nswData.stateFunctions || {}));
console.log('NSW State Constants:', nswData.stateConstants);
console.log('NSW Loading State:', nswData.isLoading);

// Test VIC state selection
console.log('\n=== TESTING VIC STATE ===');
const vicData = useStateSelector('VIC');
console.log('VIC State Functions:', Object.keys(vicData.stateFunctions || {}));
console.log('VIC State Constants:', vicData.stateConstants);
console.log('VIC Loading State:', vicData.isLoading);

// Test unknown state (should fallback to NSW)
console.log('\n=== TESTING UNKNOWN STATE (QLD) ===');
const qldData = useStateSelector('QLD');
console.log('QLD State Functions:', Object.keys(qldData.stateFunctions || {}));
console.log('QLD State Constants:', qldData.stateConstants);
console.log('QLD Loading State:', qldData.isLoading);

console.log('\n🎉 useStateSelector TESTS COMPLETE!');
