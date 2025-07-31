"use client";

import React from 'react';
import Header from '../components/Header.js';
import PropertyDetails from '../components/PropertyDetails.js';
import LoanDetails from '../components/LoanDetails.js';
import OtherFees from '../components/OtherFees.js';
import ResultsSection from '../components/ResultsSection.js';
import Footer from '../components/Footer.js';
import { usePropertyData } from '../hooks/usePropertyData.js';
import { useLoanDetails } from '../hooks/useLoanDetails.js';
import { useCalculations } from '../hooks/useCalculations.js';

export default function App() {
  const {
    propertyData,
    setPropertyData,
    useEstimatedPrice,
    setUseEstimatedPrice,
    isForeignBuyer,
    setIsForeignBuyer,
    isFirstHomeBuyer,
    setIsFirstHomeBuyer,
    isSearching,
    searchError,
    includeLandTransferFee,
    setIncludeLandTransferFee,
    includeLegalFees,
    setIncludeLegalFees,
    includeInspectionFees,
    setIncludeInspectionFees,
    handleAddressSearch
  } = usePropertyData();

  const {
    loanDetails,
    setLoanDetails
  } = useLoanDetails();

  const results = useCalculations(
    propertyData, 
    loanDetails,
    setLoanDetails,
    isForeignBuyer, 
    isFirstHomeBuyer, 
    useEstimatedPrice,
    includeLandTransferFee,
    includeLegalFees,
    includeInspectionFees
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <PropertyDetails
              propertyData={propertyData}
              setPropertyData={setPropertyData}
              loanDetails={loanDetails}
              setLoanDetails={setLoanDetails}
              isForeignBuyer={isForeignBuyer}
              setIsForeignBuyer={setIsForeignBuyer}
              isFirstHomeBuyer={isFirstHomeBuyer}
              setIsFirstHomeBuyer={setIsFirstHomeBuyer}
              useEstimatedPrice={useEstimatedPrice}
              setUseEstimatedPrice={setUseEstimatedPrice}
              isSearching={isSearching}
              searchError={searchError}
              onAddressSearch={handleAddressSearch}
              depositWarning={results.depositWarning}
              depositPercentage={results.depositPercentage}
            />

            <LoanDetails
              loanDetails={loanDetails}
              setLoanDetails={setLoanDetails}
              shouldShowLMI={results.shouldShowLMI}
              shouldDefaultLMI={results.shouldDefaultLMI}
              depositWarning={results.depositWarning}
              depositPercentage={results.depositPercentage}
              price={useEstimatedPrice ? propertyData.estimatedPrice || 0 : propertyData.price}
              hasMortgage={results.hasMortgage}
            />

            <OtherFees
              includeLandTransferFee={includeLandTransferFee}
              setIncludeLandTransferFee={setIncludeLandTransferFee}
              includeLegalFees={includeLegalFees}
              setIncludeLegalFees={setIncludeLegalFees}
              includeInspectionFees={includeInspectionFees}
              setIncludeInspectionFees={setIncludeInspectionFees}
              price={useEstimatedPrice ? propertyData.estimatedPrice || 0 : propertyData.price}
              deposit={loanDetails.deposit}
              stampDuty={results.stampDuty}
              foreignBuyerDuty={results.foreignBuyerDuty}
              landTransferFee={results.landTransferFee}
              legalFees={results.legalFees}
              inspectionFees={results.inspectionFees}
            />
          </div>

          {/* Results Section */}
          <ResultsSection
            results={results}
            loanDetails={loanDetails}
            isForeignBuyer={isForeignBuyer}
          />
        </div>
      </div>
    </div>
  );
}