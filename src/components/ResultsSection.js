import { DollarSign, FileText, Globe, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/calculations.js';
import LoanSummaryCard from './LoanSummaryCard.js';

export default function ResultsSection({ results, loanDetails, isForeignBuyer, includeBodyCorporate }) {
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
              <span className="text-gray-600">Mortgage Registration</span>
              <span className="font-semibold">
                {formatCurrency(results.mortgageRegistrationFee)}
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
          {results.firstHomeOwnersGrant > 0 && (
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
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monthly Costs</h3>
        </div>
        
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
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Annual Costs</h3>
        </div>
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
    </div>
  );
} 