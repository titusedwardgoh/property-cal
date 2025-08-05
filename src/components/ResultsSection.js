import { DollarSign, FileText, Globe, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/calculations.js';
import LoanSummaryCard from './LoanSummaryCard.js';

export default function ResultsSection({ results, loanDetails, isForeignBuyer, includeBodyCorporate, hasCalculated, fieldsChanged, onCalculate, propertyData, isFirstHomeBuyer }) {
  // Check if all required fields for FHOG calculation are filled
  const isCalculationValid = () => {
    if (!isFirstHomeBuyer) return false;
    if (!propertyData.price || propertyData.price <= 0) return false;
    if (!propertyData.state) return false;
    if (!propertyData.propertyType) return false;
    if (!propertyData.propertyCategory) return false;
    
    // For land properties, require estimated build cost (can be 0 if user wants)
    if (propertyData.propertyCategory === 'land') {
      if (propertyData.estimatedBuildCost === undefined || propertyData.estimatedBuildCost === null) return false;
    }
    
    // For Western Australia, require region selection
    if (propertyData.state === 'WA') {
      if (!propertyData.waRegion) return false;
    }
    
    return true;
  };

  const canCalculate = isCalculationValid();
  
  return (
    <div className="space-y-6">
      {/* Upfront Costs */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Upfront Costs</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Deposit</span>
            <span className="font-semibold">
              {formatCurrency(loanDetails.deposit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Stamp Duty</span>
            <span className="font-semibold">
              {formatCurrency(results.stampDuty)}
            </span>
          </div>
          {isForeignBuyer && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Foreign Buyer Duty</span>
              <span className="font-semibold">
                {formatCurrency(results.foreignBuyerDuty)}
              </span>
            </div>
          )}
          {results.landTransferFee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Land Transfer Fee</span>
              <span className="font-semibold">
                {formatCurrency(results.landTransferFee)}
              </span>
            </div>
          )}
          {results.mortgageRegistrationFee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bank Settlement Fee</span>
              <span className="font-semibold">
                {formatCurrency(results.mortgageRegistrationFee)}
              </span>
            </div>
          )}
          {results.loanEstablishmentFee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Loan Establishment Fee</span>
              <span className="font-semibold">
                {formatCurrency(results.loanEstablishmentFee)}
              </span>
            </div>
          )}
          {results.legalFees > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Legal/Conveyancing</span>
              <span className="font-semibold">
                {formatCurrency(results.legalFees)}
              </span>
            </div>
          )}
          {results.inspectionFees > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Building & Pest Inspection</span>
              <span className="font-semibold">
                {formatCurrency(results.inspectionFees)}
              </span>
            </div>
          )}
          {hasCalculated && results.firstHomeOwnersGrant > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">First Home Owners Grant</span>
              <span className="font-semibold text-green-600">
                -{formatCurrency(results.firstHomeOwnersGrant)}
              </span>
            </div>
          )}
          <hr />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Upfront</span>
            <span className="font-bold text-xl text-orange-600">
              {formatCurrency(results.totalUpfrontCosts)}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Repayments */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monthly Costs</h3>
        </div>
        {loanDetails.repaymentType && loanDetails.repaymentType.startsWith('interest-only-') && (
          <p className="text-sm text-gray-600 mb-4">
            (for the first {loanDetails.repaymentType.split('-')[2]} {loanDetails.repaymentType.split('-')[2] === '1' ? 'year' : 'years'})
          </p>
        )}
        
        <div className="space-y-3">
          {results.hasLoan && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Loan Repayment</span>
              <span className="font-semibold text-lg">
                {formatCurrency(results.monthlyRepayment)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Council Rates</span>
            <span className="font-semibold">
              {formatCurrency(results.councilRates / 12)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Water Rates</span>
            <span className="font-semibold">
              {formatCurrency(results.waterRates / 12)}
            </span>
          </div>
          {includeBodyCorporate && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Body Corporate/Strata</span>
              <span className="font-semibold">
                {formatCurrency(results.bodyCorporate / 12)}
              </span>
            </div>
          )}
          {results.landTax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Land Tax</span>
              <span className="font-semibold">
                {formatCurrency(results.landTax / 12)}
              </span>
            </div>
          )}
          <hr />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Monthly</span>
            <span className="font-bold text-xl text-blue-600">
              {formatCurrency(results.totalMonthlyCosts)}
            </span>
          </div>
        </div>
      </div>

      {/* Annual Costs */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-2">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Annual Costs</h3>
        </div>
        {loanDetails.repaymentType && loanDetails.repaymentType.startsWith('interest-only-') && (
          <p className="text-sm text-gray-600 mb-4">
            (for the first {loanDetails.repaymentType.split('-')[2]} {loanDetails.repaymentType.split('-')[2] === '1' ? 'year' : 'years'})
          </p>
        )}
        <div className="space-y-3">
          {results.hasLoan && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Loan Repayment</span>
              <span className="font-semibold text-lg">
                {formatCurrency(results.monthlyRepayment * 12)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Council Rates</span>
            <span className="font-semibold">
              {formatCurrency(results.councilRates)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Water Rates</span>
            <span className="font-semibold">
              {formatCurrency(results.waterRates)}
            </span>
          </div>
          {includeBodyCorporate && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Body Corporate/Strata</span>
              <span className="font-semibold">
                {formatCurrency(results.bodyCorporate)}
              </span>
            </div>
          )}
          {results.landTax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Land Tax</span>
              <span className="font-semibold">
                {formatCurrency(results.landTax)}
              </span>
            </div>
          )}
          <hr />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Annual</span>
            <span className="font-bold text-xl text-purple-600">
              {formatCurrency(results.totalMonthlyCosts * 12)}
            </span>
          </div>
        </div>
      </div>
      
      <LoanSummaryCard 
        lvr={results.lvr}
        totalRepayments={results.totalRepayments}
        totalInterest={results.totalInterest}
      />
      
      {/* Calculate Button */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <button
          onClick={onCalculate}
          disabled={!canCalculate || (hasCalculated && !fieldsChanged)}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors focus:ring-4 focus:outline-none ${
            !canCalculate
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed focus:ring-gray-200'
              : hasCalculated && !fieldsChanged
                ? 'bg-green-600 text-white cursor-not-allowed focus:ring-green-200' 
                : fieldsChanged 
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200'
          }`}
        >
          {!canCalculate ? 'Complete Required Fields' : hasCalculated && !fieldsChanged ? 'Calculations Complete' : fieldsChanged ? 'Recalculate' : 'Calculate'}
        </button>
      </div>
    </div>
  );
} 