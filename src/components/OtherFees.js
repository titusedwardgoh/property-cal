import React, { useState } from 'react';
import { Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../utils/calculations.js';
import SellerQuestions from './SellerQuestions.js';
import LoanDetails from './LoanDetails.js';

export default function OtherFees({
  includeLandTransferFee,
  setIncludeLandTransferFee,
  includeLegalFees,
  setIncludeLegalFees,
  includeInspectionFees,
  setIncludeInspectionFees,
  price,
  landTransferFee,
  legalFees,
  inspectionFees,
  setLandTransferFee,
  setLegalFees,
  setInspectionFees,
  propertyData,
  setPropertyData,
  includeCouncilRates,
  setIncludeCouncilRates,
  includeWaterRates,
  setIncludeWaterRates,
  councilRates,
  waterRates,
  setCouncilRates,
  setWaterRates,
  includeBodyCorporate,
  setIncludeBodyCorporate,
  bodyCorporate,
  setBodyCorporate,
  loanDetails,
  setLoanDetails,
  shouldShowLMI,
  shouldDefaultLMI,
  depositWarning,
  depositPercentage,
  hasMortgage,
  useEstimatedPrice,
  needsLoan
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show fees when property price has been entered
  if (!price || price <= 0) {
    return (
      <div className="space-y-6">
        <SellerQuestions
          price={price}
          propertyData={propertyData}
          setPropertyData={setPropertyData}
          includeBodyCorporate={includeBodyCorporate}
          setIncludeBodyCorporate={setIncludeBodyCorporate}
          bodyCorporate={bodyCorporate}
          setBodyCorporate={setBodyCorporate}
          councilRates={councilRates}
          setCouncilRates={setCouncilRates}
          waterRates={waterRates}
          setWaterRates={setWaterRates}
        />

        {needsLoan && (
          <LoanDetails
            loanDetails={loanDetails}
            setLoanDetails={setLoanDetails}
            shouldShowLMI={shouldShowLMI}
            shouldDefaultLMI={shouldDefaultLMI}
            depositWarning={depositWarning}
            depositPercentage={depositPercentage}
            price={price}
            hasMortgage={hasMortgage}
            propertyData={propertyData}
            useEstimatedPrice={useEstimatedPrice}
          />
        )}

        {/* Other Hidden Fees Card - Disabled */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Receipt className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Other Hidden Fees</h2>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg opacity-50 cursor-not-allowed transition-colors"
              disabled={true}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Enter property price to see available fees
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SellerQuestions
        price={price}
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        includeBodyCorporate={includeBodyCorporate}
        setIncludeBodyCorporate={setIncludeBodyCorporate}
        bodyCorporate={bodyCorporate}
        setBodyCorporate={setBodyCorporate}
        councilRates={councilRates}
        setCouncilRates={setCouncilRates}
        waterRates={waterRates}
        setWaterRates={setWaterRates}
      />

      {needsLoan && (
        <LoanDetails
          loanDetails={loanDetails}
          setLoanDetails={setLoanDetails}
          shouldShowLMI={shouldShowLMI}
          shouldDefaultLMI={shouldDefaultLMI}
          depositWarning={depositWarning}
          depositPercentage={depositPercentage}
          price={price}
          hasMortgage={hasMortgage}
          propertyData={propertyData}
          useEstimatedPrice={useEstimatedPrice}
        />
      )}

      {/* Other Hidden Fees Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Receipt className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Other Hidden Fees</h2>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* Land Transfer Fee */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="landTransferFee"
                  checked={includeLandTransferFee}
                  onChange={(e) => setIncludeLandTransferFee(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label htmlFor="landTransferFee" className="text-sm font-medium text-gray-900">
                    Land Transfer Fee
                  </label>
                  <p className="text-xs text-gray-600">
                    Official registration of property ownership
                  </p>
                </div>
              </div>
              {includeLandTransferFee && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    value={landTransferFee ? Math.round(Number(landTransferFee)) : ''}
                    onChange={(e) => setLandTransferFee(Number(e.target.value) || 0)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            {/* Legal & Conveyancing */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="legalFees"
                  checked={includeLegalFees}
                  onChange={(e) => setIncludeLegalFees(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label htmlFor="legalFees" className="text-sm font-medium text-gray-900">
                    Legal & Conveyancing
                  </label>
                  <p className="text-xs text-gray-600">
                    Legal services for property transfer
                  </p>
                </div>
              </div>
              {includeLegalFees && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    value={legalFees ? Math.round(Number(legalFees)) : ''}
                    onChange={(e) => setLegalFees(Number(e.target.value) || 0)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            {/* Building & Pest Inspection */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="inspectionFees"
                  checked={includeInspectionFees}
                  onChange={(e) => setIncludeInspectionFees(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label htmlFor="inspectionFees" className="text-sm font-medium text-gray-900">
                    Building & Pest Inspection
                  </label>
                  <p className="text-xs text-gray-600">
                    Pre-purchase property condition assessment
                  </p>
                </div>
              </div>
              {includeInspectionFees && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    value={inspectionFees ? Math.round(Number(inspectionFees)) : ''}
                    onChange={(e) => setInspectionFees(Number(e.target.value) || 0)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 