"use client";

import React from 'react';
import Header from '../components/Header.js';
import PropertyDetails from '../components/PropertyDetails.js';
import BuyerDetails from '../components/BuyerDetails.js';
import LoanDetails from '../components/LoanDetails.js';
import OtherFees from '../components/OtherFees.js';
import ResultsSection from '../components/ResultsSection.js';
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
    isInvestor,
    setIsInvestor,
    needsLoan,
    setNeedsLoan,
    isSearching,
    searchError,
    includeOtherFees,
    setIncludeOtherFees,
    includeLandTransferFee,
    setIncludeLandTransferFee,
    includeLegalFees,
    setIncludeLegalFees,
    includeInspectionFees,
    setIncludeInspectionFees,
    customLandTransferFee,
    setCustomLandTransferFee,
    customLegalFees,
    setCustomLegalFees,
    customInspectionFees,
    setCustomInspectionFees,
    includeCouncilRates,
    setIncludeCouncilRates,
    includeWaterRates,
    setIncludeWaterRates,
    customCouncilRates,
    setCustomCouncilRates,
    customWaterRates,
    setCustomWaterRates,
    includeBodyCorporate,
    setIncludeBodyCorporate,
    customBodyCorporate,
    setCustomBodyCorporate,
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
    isInvestor,
    useEstimatedPrice,
    includeLandTransferFee,
    includeLegalFees,
    includeInspectionFees,
    needsLoan,
    customLandTransferFee,
    customLegalFees,
    customInspectionFees,
    includeCouncilRates,
    includeWaterRates,
    customCouncilRates,
    customWaterRates,
    includeBodyCorporate,
    customBodyCorporate
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <BuyerDetails
              needsLoan={needsLoan}
              setNeedsLoan={setNeedsLoan}
              isForeignBuyer={isForeignBuyer}
              setIsForeignBuyer={setIsForeignBuyer}
              isFirstHomeBuyer={isFirstHomeBuyer}
              setIsFirstHomeBuyer={setIsFirstHomeBuyer}
              isInvestor={isInvestor}
              setIsInvestor={setIsInvestor}
              isSearching={isSearching}
              propertyPrice={propertyData.price}
            />

            <PropertyDetails
              propertyData={propertyData}
              setPropertyData={setPropertyData}
              loanDetails={loanDetails}
              setLoanDetails={setLoanDetails}
              useEstimatedPrice={useEstimatedPrice}
              setUseEstimatedPrice={setUseEstimatedPrice}
              isSearching={isSearching}
              searchError={searchError}
              onAddressSearch={handleAddressSearch}
              isInvestor={isInvestor}
              isForeignBuyer={isForeignBuyer}
              isFirstHomeBuyer={isFirstHomeBuyer}
              needsLoan={needsLoan}
            />

            {needsLoan && (
              <LoanDetails
                loanDetails={loanDetails}
                setLoanDetails={setLoanDetails}
                shouldShowLMI={results.shouldShowLMI}
                shouldDefaultLMI={results.shouldDefaultLMI}
                depositWarning={results.depositWarning}
                depositPercentage={results.depositPercentage}
                price={useEstimatedPrice ? propertyData.estimatedPrice || 0 : propertyData.price}
                hasMortgage={results.hasMortgage}
                propertyData={propertyData}
                useEstimatedPrice={useEstimatedPrice}
              />
            )}

            <OtherFees
              includeLandTransferFee={includeLandTransferFee}
              setIncludeLandTransferFee={setIncludeLandTransferFee}
              includeLegalFees={includeLegalFees}
              setIncludeLegalFees={setIncludeLegalFees}
              includeInspectionFees={includeInspectionFees}
              setIncludeInspectionFees={setIncludeInspectionFees}
              price={useEstimatedPrice ? propertyData.estimatedPrice || 0 : propertyData.price}
              landTransferFee={customLandTransferFee > 0 ? customLandTransferFee : results.landTransferFee}
              legalFees={customLegalFees > 0 ? customLegalFees : results.legalFees}
              inspectionFees={customInspectionFees > 0 ? customInspectionFees : results.inspectionFees}
              setLandTransferFee={setCustomLandTransferFee}
              setLegalFees={setCustomLegalFees}
              setInspectionFees={setCustomInspectionFees}
              propertyData={propertyData}
              setPropertyData={setPropertyData}
              includeCouncilRates={includeCouncilRates}
              setIncludeCouncilRates={setIncludeCouncilRates}
              includeWaterRates={includeWaterRates}
              setIncludeWaterRates={setIncludeWaterRates}
              councilRates={customCouncilRates > 0 ? customCouncilRates : results.councilRates}
              waterRates={customWaterRates > 0 ? customWaterRates : results.waterRates}
              setCouncilRates={setCustomCouncilRates}
              setWaterRates={setCustomWaterRates}
              includeBodyCorporate={includeBodyCorporate}
              setIncludeBodyCorporate={setIncludeBodyCorporate}
              bodyCorporate={customBodyCorporate}
              setBodyCorporate={setCustomBodyCorporate}
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