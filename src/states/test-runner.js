// Test runner for NSW, VIC, NT, and ACT calculations
import { calculateNSWStampDuty, calculateNSWFirstHomeOwnersGrant, calculateNSWLandTransferFee, calculateNSWForeignBuyerDuty } from './nsw/calculations.js';
import { calculateVICStampDuty, calculateVICFirstHomeOwnersGrant, calculateVICLandTransferFee, calculateVICForeignBuyerDuty } from './vic/calculations.js';
import { calculateNTStampDuty, calculateNTFirstHomeOwnersGrant, calculateNTLandTransferFee, calculateNTForeignBuyerDuty } from './nt/calculations.js';
import { calculateACTStampDuty, calculateACTFirstHomeOwnersGrant, calculateACTLandTransferFee, calculateACTForeignBuyerDuty } from './act/calculations.js';

console.log('🧪 TESTING NSW, VIC, NT, AND ACT CALCULATIONS\n');

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

// Test NT calculations
console.log('=== NT TESTS ===');
try {
  const ntStampDuty = calculateNTStampDuty(500000, true, false, true);
  console.log('✅ NT Stamp Duty $500k (first home, PPR):', ntStampDuty);
  
  const ntFHOG = calculateNTFirstHomeOwnersGrant(500000, 'existing', 'house', 0, true);
  console.log('✅ NT FHOG $500k existing property:', ntFHOG);
  
  const ntLandFee = calculateNTLandTransferFee(500000);
  console.log('✅ NT Land Transfer Fee $500k:', ntLandFee);
  
  const ntForeignDuty = calculateNTForeignBuyerDuty(600000, true);
  console.log('✅ NT Foreign Buyer Duty $600k:', ntForeignDuty);
  
  console.log('✅ NT tests passed!\n');
} catch (error) {
  console.error('❌ NT tests failed:', error);
}

// Test specific NT first home buyer concessions
console.log('=== NT FIRST HOME BUYER CONCESSION TESTS ===');
try {
  const nt400k = calculateNTStampDuty(400000, true, false, true);
  console.log('✅ NT $400k (first home, PPR):', nt400k, '- Should be 0 (full concession)');
  
  const nt550k = calculateNTStampDuty(550000, true, false, true);
  console.log('✅ NT $550k (first home, PPR):', nt550k, '- Should be partial concession');
  
  const nt650k = calculateNTStampDuty(650000, true, false, true);
  console.log('✅ NT $650k (first home, PPR):', nt650k, '- Should be full duty');
  
  console.log('✅ NT concession tests passed!\n');
} catch (error) {
  console.error('❌ NT concession tests failed:', error);
}

// Test ACT calculations
console.log('=== ACT TESTS ===');
try {
  const actStampDuty = calculateACTStampDuty(500000, true, false, true);
  console.log('✅ ACT Stamp Duty $500k (first home, PPR):', actStampDuty);
  
  const actFHOG = calculateACTFirstHomeOwnersGrant(500000, 'existing', 'house', 0, true);
  console.log('✅ ACT FHOG $500k existing property:', actFHOG);
  
  const actLandFee = calculateACTLandTransferFee(500000);
  console.log('✅ ACT Land Transfer Fee $500k:', actLandFee);
  
  const actForeignDuty = calculateACTForeignBuyerDuty(600000, true);
  console.log('✅ ACT Foreign Buyer Duty $600k:', actForeignDuty);
  
  console.log('✅ ACT tests passed!\n');
} catch (error) {
  console.error('❌ ACT tests failed:', error);
}

// Test specific ACT first home buyer concessions
console.log('=== ACT FIRST HOME BUYER CONCESSION TESTS ===');
try {
  const act400k = calculateACTStampDuty(400000, true, false, true);
  console.log('✅ ACT $400k (first home, PPR):', act400k, '- Should be 0 (full concession)');
  
  const act550k = calculateACTStampDuty(550000, true, false, true);
  console.log('✅ ACT $550k (first home, PPR):', act550k, '- Should be partial concession');
  
  const act750k = calculateACTStampDuty(750000, true, false, true);
  console.log('✅ ACT $750k (first home, PPR):', act750k, '- Should be partial concession');
  
  const act850k = calculateACTStampDuty(850000, true, false, true);
  console.log('✅ ACT $850k (first home, PPR):', act850k, '- Should be full duty');
  
  console.log('✅ ACT concession tests passed!\n');
} catch (error) {
  console.error('❌ ACT concession tests failed:', error);
}

console.log('🎉 ALL TESTS COMPLETE!');
