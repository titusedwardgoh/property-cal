import { useState, useEffect, useRef } from 'react';
import { 
  calculateStampDuty, 
  calculateForeignBuyerDuty, 
  calculateLandTransferFee, 
  calculateLegalFees, 
  calculateInspectionFees, 
  calculateLMI, 
  calculateMonthlyRepayment, 
  calculateCouncilRates,
  calculateWaterRates,
  calculateBodyCorporate,
  calculateFirstHomeOwnersGrant,
  calculateLandTax
} from '../utils/calculations.js';

export function useCalculations(propertyData, loanDetails, setLoanDetails, isForeignBuyer, isFirstHomeBuyer, isInvestor, useEstimatedPrice, includeLandTransferFee, includeLegalFees, includeInspectionFees, needsLoan, customLandTransferFee, customLegalFees, customInspectionFees, includeCouncilRates, includeWaterRates, customCouncilRates, customWaterRates, includeBodyCorporate, customBodyCorporate) {
  const [results, setResults] = useState({
    monthlyRepayment: 0,
    stampDuty: 0,
    foreignBuyerDuty: 0,
    councilRates: 0,
    landTax: 0,
    landTransferFee: 0,
    mortgageRegistrationFee: 0,
    legalFees: 0,
    inspectionFees: 0,
    lmiAmount: 0,
    totalUpfrontCosts: 0,
    totalMonthlyCosts: 0
  });
  
  // Store the last manually entered deposit amount
  const lastManualDeposit = useRef(0);
  const isUpdatingDeposit = useRef(false);

  // Calculate deposit percentage and LMI requirements
  const price = useEstimatedPrice ? propertyData.estimatedPrice || 0 : propertyData.price;
  const depositPercentage = price > 0 ? (loanDetails.deposit / price) * 100 : 0;
  
  // Calculate stamp duty for LMI determination
  const stampDutyForLMI = price > 0 ? calculateStampDuty(price, propertyData.state, isFirstHomeBuyer) : 0;
  const totalPropertyCost = price + stampDutyForLMI;
  const depositPercentageOfTotal = totalPropertyCost > 0 ? (loanDetails.deposit / totalPropertyCost) * 100 : 0;
  
  // Calculate if mortgage is needed for mortgage registration fee
  const stampDuty = calculateStampDuty(price, propertyData.state, isFirstHomeBuyer);
  const foreignBuyerDuty = calculateForeignBuyerDuty(price, propertyData.state, isForeignBuyer);
  const calculatedLandTransferFee = (price > 0 && includeLandTransferFee) ? calculateLandTransferFee(price, propertyData.state) : 0;
  const calculatedLegalFees = (price > 0 && includeLegalFees) ? calculateLegalFees(price, propertyData.propertyType) : 0;
  const calculatedInspectionFees = (price > 0 && includeInspectionFees) ? calculateInspectionFees(price) : 0;
  const calculatedCouncilRates = (price > 0 && includeCouncilRates) ? calculateCouncilRates(price, propertyData.state) : 0;
  const calculatedWaterRates = (price > 0 && includeWaterRates) ? calculateWaterRates(price, propertyData.state) : 0;
  const calculatedBodyCorporate = (price > 0 && includeBodyCorporate) ? calculateBodyCorporate(price, propertyData.propertyCategory) : 0;
  
  // Use custom values if they exist and are greater than 0, otherwise use calculated values
  const landTransferFee = (includeLandTransferFee && customLandTransferFee && customLandTransferFee > 0) ? customLandTransferFee : calculatedLandTransferFee;
  const legalFees = (includeLegalFees && customLegalFees && customLegalFees > 0) ? customLegalFees : calculatedLegalFees;
  const inspectionFees = (includeInspectionFees && customInspectionFees && customInspectionFees > 0) ? customInspectionFees : calculatedInspectionFees;
  const councilRates = (includeCouncilRates && customCouncilRates && customCouncilRates > 0) ? customCouncilRates : calculatedCouncilRates;
  const waterRates = (includeWaterRates && customWaterRates && customWaterRates > 0) ? customWaterRates : calculatedWaterRates;
  const bodyCorporate = (includeBodyCorporate && customBodyCorporate && customBodyCorporate > 0) ? customBodyCorporate : calculatedBodyCorporate;
  const upfrontCostsExcludingMortgageReg = stampDuty + foreignBuyerDuty + landTransferFee + legalFees + inspectionFees;
  const hasMortgage = needsLoan && price > 0 && loanDetails.deposit > 0 && loanDetails.deposit < (price + upfrontCostsExcludingMortgageReg);
  
  // Determine LMI requirements based on deposit percentage of total cost
  let shouldShowLMI = false;
  let shouldDefaultLMI = false;
  let depositWarning = null;
  
  // Only show warnings and LMI logic when both price and deposit have values
  if (price > 0 && loanDetails.deposit > 0) {
    if (depositPercentageOfTotal < 5) {
      shouldShowLMI = true;
      shouldDefaultLMI = true;
      depositWarning = "You need at least 5% to get a loan from most banks";
    } else if (depositPercentageOfTotal < 20) {
      shouldShowLMI = true;
      shouldDefaultLMI = true; // Auto-check initially
    } else {
      shouldShowLMI = false;
      shouldDefaultLMI = false;
    }
  }

  useEffect(() => {
    // Handle deposit logic
    if (!isUpdatingDeposit.current) {
      isUpdatingDeposit.current = true;
      
      // If price is 0 or negative, reset deposit to 0
      if (price <= 0) {
        setLoanDetails(prev => ({ ...prev, deposit: 0 }));
        lastManualDeposit.current = 0;
      }
      // If no loan is needed, set deposit to property price
      else if (!needsLoan && price > 0) {
        setLoanDetails(prev => ({ ...prev, deposit: price }));
      }
      // If loan is needed and we have a stored manual deposit, use it
      else if (needsLoan && price > 0 && lastManualDeposit.current > 0) {
        setLoanDetails(prev => ({ ...prev, deposit: lastManualDeposit.current }));
      }
      // If loan is needed for the first time, set deposit to 0
      else if (needsLoan && price > 0 && lastManualDeposit.current === 0) {
        setLoanDetails(prev => ({ ...prev, deposit: 0 }));
      }
      
      // Store manual deposit changes (but not when we're programmatically setting it)
      if (needsLoan && loanDetails.deposit > 0 && loanDetails.deposit !== price && loanDetails.deposit !== lastManualDeposit.current) {
        lastManualDeposit.current = loanDetails.deposit;
      }
      
      isUpdatingDeposit.current = false;
    }
    
    // Calculate mortgage registration fee using the editable amount
    const mortgageRegistrationFee = hasMortgage ? loanDetails.mortgageRegistrationFee : 0;
    
    // Calculate First Home Owners Grant
    const firstHomeOwnersGrant = isFirstHomeBuyer ? calculateFirstHomeOwnersGrant(price, propertyData.state) : 0;
    
    // Calculate upfront costs excluding LMI and grant
    const upfrontCostsExcludingLMI = stampDuty + foreignBuyerDuty + loanDetails.deposit + 
                                    landTransferFee + mortgageRegistrationFee + legalFees + inspectionFees;
    
    // Calculate initial loan amount based on property price only (upfront fees can't be financed)
    const initialLoanAmount = needsLoan && loanDetails.deposit > 0 ? Math.max(0, price - loanDetails.deposit) : 0;
    
    // Calculate LMI if checkbox is checked and loan is needed
    const lmiAmount = needsLoan && loanDetails.includeLMI ? calculateLMI(initialLoanAmount, price, 0) : 0;
    
    // Add LMI to the loan amount (LMI gets financed)
    const finalLoanAmount = initialLoanAmount + lmiAmount;
    
    // Calculate upfront costs (excluding LMI since it's added to loan amount)
    const totalUpfrontCosts = upfrontCostsExcludingLMI - firstHomeOwnersGrant;
    
    const monthlyRepayment = needsLoan && finalLoanAmount > 0 ? calculateMonthlyRepayment(
      finalLoanAmount,
      loanDetails.interestRate,
      loanDetails.loanTerm
    ) : 0;
    
    const landTax = isInvestor ? calculateLandTax(price, propertyData.state) : 0;
    const totalMonthlyCosts = monthlyRepayment + (councilRates / 12) + (waterRates / 12) + (bodyCorporate / 12) + (landTax / 12);

    // Calculate LVR (Loan to Value Ratio)
    const lvr = finalLoanAmount > 0 && totalPropertyCost > 0 ? (finalLoanAmount / totalPropertyCost) * 100 : 0;

    // Calculate total loan repayments and total interest charged
    const totalRepayments = monthlyRepayment * loanDetails.loanTerm * 12;
    const totalInterest = totalRepayments - finalLoanAmount;

    // Determine if a loan is needed
    const hasLoan = finalLoanAmount > 0;

    setResults({
      monthlyRepayment,
      stampDuty,
      foreignBuyerDuty,
      councilRates,
      waterRates,
      bodyCorporate,
      landTax,
      landTransferFee,
      mortgageRegistrationFee,
      legalFees,
      inspectionFees,
      lmiAmount,
      firstHomeOwnersGrant,
      totalUpfrontCosts,
      totalMonthlyCosts,
      lvr,
      totalRepayments,
      totalInterest,
      hasLoan
    });

    setLoanDetails(prev => ({ ...prev, loanAmount: finalLoanAmount, lmiAmount }));
  }, [propertyData, loanDetails.deposit, loanDetails.interestRate, loanDetails.loanTerm, loanDetails.includeLMI, loanDetails.mortgageRegistrationFee, isForeignBuyer, useEstimatedPrice, isFirstHomeBuyer, includeLandTransferFee, includeLegalFees, includeInspectionFees, includeCouncilRates, includeWaterRates, customLandTransferFee, customLegalFees, customInspectionFees, customCouncilRates, customWaterRates, setLoanDetails, needsLoan, isInvestor]);

  return {
    ...results,
    shouldShowLMI,
    shouldDefaultLMI,
    depositWarning,
    depositPercentage,
    hasMortgage
  };
} 