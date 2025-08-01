import { useState, useEffect, useRef } from 'react';
import { 
  calculateStampDuty, 
  calculateForeignBuyerDuty, 
  calculateLandTransferFee, 
  calculateMortgageRegistrationFee, 
  calculateLegalFees, 
  calculateInspectionFees, 
  calculateLMI, 
  calculateMonthlyRepayment, 
  calculateCouncilRates,
  calculateFirstHomeOwnersGrant,
  formatCurrency 
} from '../utils/calculations.js';

export function useCalculations(propertyData, loanDetails, setLoanDetails, isForeignBuyer, isFirstHomeBuyer, useEstimatedPrice, includeLandTransferFee, includeLegalFees, includeInspectionFees, needsLoan) {
  const [results, setResults] = useState({
    monthlyRepayment: 0,
    stampDuty: 0,
    foreignBuyerDuty: 0,
    councilRates: 0,
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
  const landTransferFee = (price > 0 && includeLandTransferFee) ? calculateLandTransferFee(price) : 0;
  const legalFees = (price > 0 && includeLegalFees) ? calculateLegalFees(price) : 0;
  const inspectionFees = (price > 0 && includeInspectionFees) ? calculateInspectionFees(price) : 0;
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
      
      // If no loan is needed, set deposit to property price
      if (!needsLoan && price > 0) {
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
    
    const councilRates = calculateCouncilRates(price);
    const totalMonthlyCosts = monthlyRepayment + (councilRates / 12);

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
  }, [propertyData, loanDetails.deposit, loanDetails.interestRate, loanDetails.loanTerm, loanDetails.includeLMI, loanDetails.mortgageRegistrationFee, isForeignBuyer, useEstimatedPrice, isFirstHomeBuyer, includeLandTransferFee, includeLegalFees, includeInspectionFees, setLoanDetails, hasMortgage, stampDuty, foreignBuyerDuty, landTransferFee, legalFees, inspectionFees, totalPropertyCost, price, needsLoan]);

  return {
    ...results,
    shouldShowLMI,
    shouldDefaultLMI,
    depositWarning,
    depositPercentage,
    hasMortgage
  };
} 