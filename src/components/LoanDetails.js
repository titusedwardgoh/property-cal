import React from 'react';
import { Calculator, Shield } from 'lucide-react';
import { formatCurrency } from '../utils/calculations.js';

export default function LoanDetails({ 
  loanDetails, 
  setLoanDetails, 
  shouldShowLMI, 
  shouldDefaultLMI, 
  depositWarning, 
  depositPercentage,
  hasMortgage
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Loan Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={loanDetails.interestRate}
            onChange={(e) => setLoanDetails(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (years)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={loanDetails.loanTerm}
            onChange={(e) => setLoanDetails(prev => ({ ...prev, loanTerm: Number(e.target.value) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter loan term..."
          />
        </div>
      </div>

      {hasMortgage && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mortgage Registration Fee
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={loanDetails.mortgageRegistrationFee}
            onChange={(e) => setLoanDetails(prev => ({ ...prev, mortgageRegistrationFee: Number(e.target.value) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter mortgage registration fee..."
          />
          <p className="text-xs text-gray-600 mt-1">
            Fee for registering the lender's security interest
          </p>
        </div>
      )}

      {shouldShowLMI && (
        <div className="mt-6">
          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              id="includeLMI"
              checked={loanDetails.includeLMI}
              onChange={(e) => setLoanDetails(prev => ({ ...prev, includeLMI: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <div>
                <label htmlFor="includeLMI" className="text-sm font-medium text-gray-900">
                  Include Lenders Mortgage Insurance (LMI)
                </label>
                <p className="text-xs text-gray-600">
                  Required for loans with LVR above 80%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">Loan Amount:</span>
          <span className="font-semibold text-blue-900">
            {formatCurrency(loanDetails.loanAmount)}
          </span>
        </div>
        {loanDetails.includeLMI && loanDetails.lmiAmount > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-blue-800">LMI Premium:</span>
            <span className="font-semibold text-blue-900">
              {formatCurrency(loanDetails.lmiAmount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 