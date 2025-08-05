import { useState, useEffect, useRef } from 'react';
import { 
  calculateStampDuty, 
  calculateForeignBuyerDuty, 
  calculateLandTransferFee, 
  calculateLegalFees, 
  calculateInspectionFees, 
  calculateLMI, 
  calculateMonthlyRepayment, 
  calculateTotalRepayments,
  calculateCouncilRates,
  calculateWaterRates,
  calculateBodyCorporate,
  calculateFirstHomeOwnersGrant,
  calculateLandTax
} from '../utils/calculations.js';

export function useCalculations(propertyData, loanDetails, setLoanDetails, isForeignBuyer, isFirstHomeBuyer, isInvestor, useEstimatedPrice, includeLandTransferFee, includeLegalFees, includeInspectionFees, needsLoan, customLandTransferFee, customLegalFees, customInspectionFees, includeCouncilRates, includeWaterRates, customCouncilRates, customWaterRates, includeBodyCorporate, customBodyCorporate, calculateCount = 0) {
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
    firstHomeOwnersGrant: 0,
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
  const bodyCorporate = includeBodyCorporate ? (customBodyCorporate > 0 ? customBodyCorporate : 4000) : 0;
  const upfrontCostsExcludingMortgageReg = stampDuty + foreignBuyerDuty + landTransferFee + legalFees + inspectionFees;
  const hasMortgage = needsLoan && price > 0 && loanDetails.deposit > 0 && loanDetails.deposit < (price + upfrontCostsExcludingMortgageReg);
  
  // Simple LMI display logic
  let shouldShowLMI = true; // Always show LMI checkbox when loan is needed
  let shouldDefaultLMI = false; // Don't auto-check
  let depositWarning = null;
  
  // Check if deposit is too low (LVR > 95%)
  const lvr = price > 0 && loanDetails.deposit > 0 ? ((price - loanDetails.deposit) / price) * 100 : 0;
  const isDepositTooLow = lvr > 95;
  


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
      
      isUpdatingDeposit.current = false;
    }
  }, [price, needsLoan, setLoanDetails]);

  // Separate effect to track manual deposit changes
  useEffect(() => {
    // Store manual deposit changes (but not when we're programmatically setting it)
    if (needsLoan && loanDetails.deposit > 0 && loanDetails.deposit !== price && loanDetails.deposit !== lastManualDeposit.current && !isUpdatingDeposit.current) {
      lastManualDeposit.current = loanDetails.deposit;
    }
  }, [loanDetails.deposit, needsLoan, price]);


    
  // Main calculation effect
  useEffect(() => {
    // Calculate mortgage registration fee - show when loan is needed
    const mortgageRegistrationFee = needsLoan ? loanDetails.mortgageRegistrationFee : 0;
    
    // Calculate loan establishment fee - show when loan is needed
    const loanEstablishmentFee = needsLoan ? loanDetails.loanEstablishmentFee : 0;
    
    // Calculate upfront costs excluding LMI and grant
    const upfrontCostsExcludingLMI = stampDuty + foreignBuyerDuty + loanDetails.deposit + 
                                    landTransferFee + mortgageRegistrationFee + loanEstablishmentFee + legalFees + inspectionFees;
    
    // Calculate First Home Owners Grant - always start with 0
    const firstHomeOwnersGrant = results.firstHomeOwnersGrant || 0;
    
    // Calculate initial loan amount based on property price only (upfront fees can't be financed)
    const initialLoanAmount = needsLoan && loanDetails.deposit > 0 ? Math.max(0, price - loanDetails.deposit) : 0;
    
    // Calculate LMI if checkbox is checked and loan is needed
    const lmiAmount = needsLoan && loanDetails.includeLMI && initialLoanAmount > 0 ? calculateLMI(initialLoanAmount, price, 0) : 0;
    
    // Add LMI to the loan amount (LMI gets financed)
    const finalLoanAmount = initialLoanAmount + lmiAmount;
    
    // Calculate upfront costs (excluding LMI since it's added to loan amount)
    const totalUpfrontCosts = upfrontCostsExcludingLMI - firstHomeOwnersGrant;
    
    const monthlyRepayment = needsLoan && finalLoanAmount > 0 ? calculateMonthlyRepayment(
      finalLoanAmount,
      loanDetails.interestRate,
      loanDetails.loanTerm,
      loanDetails.repaymentType
    ) : 0;
    
    const landTax = isInvestor ? calculateLandTax(price, propertyData.state) : 0;
    const totalMonthlyCosts = monthlyRepayment + (councilRates / 12) + (waterRates / 12) + (bodyCorporate / 12) + (landTax / 12);

    // Calculate LVR (Loan to Value Ratio)
    const lvr = finalLoanAmount > 0 && totalPropertyCost > 0 ? (finalLoanAmount / totalPropertyCost) * 100 : 0;

    // Calculate total loan repayments and total interest charged
    const totalRepayments = needsLoan && finalLoanAmount > 0 ? calculateTotalRepayments(
      finalLoanAmount,
      loanDetails.interestRate,
      loanDetails.loanTerm,
      loanDetails.repaymentType
    ) : 0;
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
      loanEstablishmentFee,
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

    setLoanDetails(prev => ({ 
      ...prev, 
      loanAmount: finalLoanAmount, 
      lmiAmount: lmiAmount 
    }));
  }, [propertyData, propertyData.estimatedBuildCost, loanDetails.deposit, loanDetails.interestRate, loanDetails.loanTerm, loanDetails.repaymentType, loanDetails.includeLMI, loanDetails.mortgageRegistrationFee, loanDetails.loanEstablishmentFee, isForeignBuyer, useEstimatedPrice, isFirstHomeBuyer, includeLandTransferFee, includeLegalFees, includeInspectionFees, includeCouncilRates, includeWaterRates, customLandTransferFee, customLegalFees, customInspectionFees, customCouncilRates, customWaterRates, includeBodyCorporate, customBodyCorporate, setLoanDetails, needsLoan, isInvestor, price, stampDuty, foreignBuyerDuty, landTransferFee, legalFees, inspectionFees, councilRates, waterRates, bodyCorporate, totalPropertyCost]);

  // Manual FHOG calculation - only when calculate button is pressed
  useEffect(() => {
    if (calculateCount > 0) {
      let firstHomeOwnersGrant = 0;
      
      if (isFirstHomeBuyer && price > 0) {
        // For land, require both price and estimated build cost
        if (propertyData.propertyCategory === 'land') {
          if (propertyData.estimatedBuildCost !== undefined && propertyData.estimatedBuildCost !== null) {
            firstHomeOwnersGrant = calculateFirstHomeOwnersGrant(price, propertyData.state, propertyData.propertyType, propertyData.propertyCategory, propertyData.estimatedBuildCost, propertyData.waRegion);
          }
        } else {
          // For other property types, only require price
          firstHomeOwnersGrant = calculateFirstHomeOwnersGrant(price, propertyData.state, propertyData.propertyType, propertyData.propertyCategory, propertyData.estimatedBuildCost, propertyData.waRegion);
        }
      }

      // Update results with the calculated FHOG
      setResults(prev => ({
        ...prev,
        firstHomeOwnersGrant,
        totalUpfrontCosts: prev.totalUpfrontCosts + firstHomeOwnersGrant - (prev.firstHomeOwnersGrant || 0)
      }));
    }
  }, [calculateCount]); // Only depends on calculateCount - nothing else

  return {
    ...results,
    shouldShowLMI,
    shouldDefaultLMI,
    depositWarning: isDepositTooLow ? "⚠️ You need at least 5% deposit to get a loan" : depositWarning,
    depositPercentage,
    hasMortgage,
    isDepositTooLow
  };
} 