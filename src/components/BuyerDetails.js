import React, { useState } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';

export default function BuyerDetails({
  needsLoan,
  setNeedsLoan,
  isForeignBuyer,
  setIsForeignBuyer,
  isFirstHomeBuyer,
  setIsFirstHomeBuyer,
  isInvestor,
  setIsInvestor,
  isSearching,
  propertyPrice
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 capitalize">First some questions about you</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={isSearching}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Property Purpose */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">What is your purpose for buying this property?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ownerOccupier"
                  name="propertyPurpose"
                  value="owner-occupier"
                  checked={isInvestor === false}
                  onChange={() => setIsInvestor(false)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="ownerOccupier" className="text-sm text-gray-700">
                  Owner-occupier
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="investor"
                  name="propertyPurpose"
                  value="investor"
                  checked={isInvestor === true}
                  onChange={() => setIsInvestor(true)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="investor" className="text-sm text-gray-700">
                  Investor
                </label>
              </div>
            </div>
          </div>

          {/* Citizenship Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Are you an Australian citizen or permanent resident?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="australianCitizen"
                  name="citizenshipStatus"
                  value="australian"
                  checked={isForeignBuyer === false}
                  onChange={() => setIsForeignBuyer(false)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="australianCitizen" className="text-sm text-gray-700">
                  Yes
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="foreignBuyer"
                  name="citizenshipStatus"
                  value="foreign"
                  checked={isForeignBuyer === true}
                  onChange={() => setIsForeignBuyer(true)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="foreignBuyer" className="text-sm text-gray-700">
                  No, I am a foreign buyer
                </label>
              </div>
            </div>
          </div>

          {/* First Home Buyer Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Are you a first home buyer?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="firstHomeBuyerYes"
                  name="firstHomeBuyerStatus"
                  value="yes"
                  checked={isFirstHomeBuyer === true}
                  onChange={() => setIsFirstHomeBuyer(true)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="firstHomeBuyerYes" className="text-sm text-gray-700">
                  Yes
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="firstHomeBuyerNo"
                  name="firstHomeBuyerStatus"
                  value="no"
                  checked={isFirstHomeBuyer === false}
                  onChange={() => setIsFirstHomeBuyer(false)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="firstHomeBuyerNo" className="text-sm text-gray-700">
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Loan Requirement */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Do you need a loan?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="needsLoanYes"
                  name="loanRequirement"
                  value="yes"
                  checked={needsLoan === true}
                  onChange={() => setNeedsLoan(true)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="needsLoanYes" className="text-sm text-gray-700">
                  Yes
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="needsLoanNo"
                  name="loanRequirement"
                  value="no"
                  checked={needsLoan === false}
                  onChange={() => setNeedsLoan(false)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="needsLoanNo" className="text-sm text-gray-700">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 