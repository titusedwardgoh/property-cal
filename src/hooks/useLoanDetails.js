import { useState } from 'react';

export function useLoanDetails() {
  const [loanDetails, setLoanDetails] = useState({
    deposit: 0,
    interestRate: 6.5,
    loanTerm: 30,
    loanAmount: 0,
    includeLMI: false,
    lmiAmount: 0,
    mortgageRegistrationFee: 200,
    loanEstablishmentFee: 600,
    repaymentType: 'principal-interest'
  });

  const calculateLoanAmount = (propertyPrice) => {
    return Math.max(0, propertyPrice - loanDetails.deposit);
  };

  return {
    loanDetails,
    setLoanDetails,
    calculateLoanAmount
  };
} 