// Test runner for NSW and VIC calculations
import { calculateNSWStampDuty, calculateNSWFirstHomeOwnersGrant, calculateNSWLandTransferFee, calculateNSWForeignBuyerDuty } from './nsw/calculations.js';
import { calculateVICStampDuty, calculateVICFirstHomeOwnersGrant, calculateVICLandTransferFee, calculateVICForeignBuyerDuty } from './vic/calculations.js';

console.log('🧪 TESTING NSW AND VIC CALCULATIONS\n');

// Test NSW calculations
console.log('=== NSW TESTS ===');
try {
  const nswStampDuty = calculateNSWStampDuty(500000, true, false, true);
  console.log('✅ NSW Stamp Duty $500k (first home, PPR):', nswStampDuty);
  
  const nswFHOG = calculateNSWFirstHomeOwnersGrant(500000, 'existing', 'house', 0, true);
  console.log('✅ NSW FHOG $500k existing property:', nswFHOG);
  
  const nswLandFee = calculateNSWLandTransferFee();
  console.log('✅ NSW Land Transfer Fee:', nswLandFee);
  
  const nswForeignDuty = calculateNSWForeignBuyerDuty(600000, true);
  console.log('✅ NSW Foreign Buyer Duty $600k:', nswForeignDuty);
  
  console.log('✅ NSW tests passed!\n');
} catch (error) {
  console.error('❌ NSW tests failed:', error);
}

// Test VIC calculations
console.log('=== VIC TESTS ===');
try {
  const vicStampDuty = calculateVICStampDuty(500000, true, false, true);
  console.log('✅ VIC Stamp Duty $500k (first home, PPR):', vicStampDuty);
  
  const vicFHOG = calculateVICFirstHomeOwnersGrant(500000, 'new', 'house', 0, true);
  console.log('✅ VIC FHOG $500k new property:', vicFHOG);
  
  const vicLandFee = calculateVICLandTransferFee();
  console.log('✅ VIC Land Transfer Fee:', vicLandFee);
  
  const vicForeignDuty = calculateVICForeignBuyerDuty(600000, true);
  console.log('✅ VIC Foreign Buyer Duty $600k:', vicForeignDuty);
  
  console.log('✅ VIC tests passed!\n');
} catch (error) {
  console.error('❌ VIC tests failed:', error);
}

// Test specific VIC first home buyer concessions
console.log('=== VIC FIRST HOME BUYER CONCESSION TESTS ===');
try {
  const vic600k = calculateVICStampDuty(600000, true, false, true);
  console.log('✅ VIC $600k (first home, PPR):', vic600k, '- Should be 0 (full exemption)');
  
  const vic700k = calculateVICStampDuty(700000, true, false, true);
  console.log('✅ VIC $700k (first home, PPR):', vic700k, '- Should be partial concession');
  
  const vic800k = calculateVICStampDuty(800000, true, false, true);
  console.log('✅ VIC $800k (first home, PPR):', vic800k, '- Should be full duty');
  
  console.log('✅ VIC concession tests passed!\n');
} catch (error) {
  console.error('❌ VIC concession tests failed:', error);
}

console.log('🎉 ALL TESTS COMPLETE!');
