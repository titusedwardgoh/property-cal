import React, { useState, useEffect } from 'react';
import { Calculator, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../utils/calculations.js';

export default function LoanDetails({ 
  loanDetails, 
  setLoanDetails, 
  shouldShowLMI, 
  hasMortgage,
  depositWarning,
  depositPercentage,
  propertyData,
  useEstimatedPrice
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasBeenCollapsed, setHasBeenCollapsed] = useState(false);

  // Check if property details are filled in
  const isOffThePlan = propertyData.propertyType === 'off-the-plan';
  const isExistingProperty = propertyData.propertyType === 'existing';
  
  const propertyDetailsFilled = 
    propertyData.propertyType && // Property type is selected
    propertyData.state && // State is selected
    (useEstimatedPrice ? propertyData.estimatedPrice > 0 : propertyData.price > 0) && // Price is provided
    propertyData.propertyCategory && // Property category is selected
    (isExistingProperty ? propertyData.address.trim() : true); // Address required for existing properties

  // Keep collapsed when component first appears (when loan details become relevant)
  useEffect(() => {
    if (!hasBeenCollapsed) {
      setIsExpanded(false);
    }
  }, [hasBeenCollapsed]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    setHasBeenCollapsed(true); // Mark that user has interacted with the component
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Loan Details</h2>
          {!propertyDetailsFilled && (
            <span className="text-sm text-gray-500 font-normal">
              (Complete property details first)
            </span>
          )}
        </div>
        <button
          onClick={handleToggle}
          className={`p-2 rounded-lg transition-colors ${
            propertyDetailsFilled 
              ? 'hover:bg-gray-100' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!propertyDetailsFilled}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Deposit Amount
                </label>
                {depositPercentage > 0 && (
                  <span className="text-sm text-gray-600">
                    {depositPercentage.toFixed(1)}% of property price
                  </span>
                )}
              </div>
              <input
                type="number"
                value={loanDetails.deposit || 0}
                onChange={(e) => setLoanDetails(prev => ({ ...prev, deposit: Number(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter deposit amount..."
              />
              {depositWarning && depositWarning.includes('5% deposit') && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Minimum Deposit Required</h4>
                      <p className="text-sm text-red-700 mt-1">
                        You need at least 5% deposit to qualify for a loan
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={loanDetails.interestRate || 0}
                onChange={(e) => setLoanDetails(prev => ({ ...prev, interestRate: Number(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term (years)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={loanDetails.loanTerm || 0}
                onChange={(e) => setLoanDetails(prev => ({ ...prev, loanTerm: Number(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter loan term..."
              />
            </div>
          </div>


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
                    Likely required for loans with LVR above 80%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Base Loan Amount:</span>
              <span className="font-semibold text-blue-900">
                {formatCurrency(loanDetails.loanAmount - (loanDetails.lmiAmount || 0))}
              </span>
            </div>
            {loanDetails.includeLMI && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-blue-800">LMI Premium:</span>
                <span className="font-semibold text-blue-900">
                  {loanDetails.lmiAmount > 0 ? formatCurrency(loanDetails.lmiAmount) : '$0'}
                </span>
              </div>
            )}
            <hr className="my-2 border-blue-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">Total Loan Amount:</span>
              <span className="font-bold text-blue-900">
                {formatCurrency(loanDetails.loanAmount)}
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="flex gap-2 items-center">
              <p>Bank Settlement Fee</p>
              <p className="text-xs text-gray-600">
              (Fee charged by the bank for settlement processing)</p>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={loanDetails.mortgageRegistrationFee || 0}
              onChange={(e) => setLoanDetails(prev => ({ ...prev, mortgageRegistrationFee: Number(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter bank settlement fee..."
            />
            
          </div>

          <div className="mt-6">
            <label className="flex gap-2 items-center">
              <p className="text-sm font-medium text-gray-700 mb-2">Loan Establishment Fee </p> 
              <p className="text-xs text-gray-600 mb-2">
              (Fee charged by the bank for setting up your loan)
              </p>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={loanDetails.loanEstablishmentFee || 0}
              onChange={(e) => setLoanDetails(prev => ({ ...prev, loanEstablishmentFee: Number(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter loan establishment fee..."
            />
            
          </div>
        </>
      )}
    </div>
  );
} 