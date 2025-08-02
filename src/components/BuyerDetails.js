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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 capitalize">A bit about You</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
          {/* Who are you? */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Who are you?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="firstHomeBuyer"
                  checked={isFirstHomeBuyer}
                  onChange={(e) => setIsFirstHomeBuyer(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="firstHomeBuyer" className="text-sm text-gray-700">
                  First home buyer
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="foreignBuyer"
                  checked={isForeignBuyer}
                  onChange={(e) => setIsForeignBuyer(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="foreignBuyer" className="text-sm text-gray-700">
                  Foreign buyer
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="investor"
                  checked={isInvestor}
                  onChange={(e) => setIsInvestor(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="investor" className="text-sm text-gray-700">
                  Investor
                </label>
              </div>
            </div>
          </div>

          {/* Financing */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Financing</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="needsLoan"
                checked={needsLoan}
                onChange={(e) => setNeedsLoan(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSearching}
              />
              <label htmlFor="needsLoan" className="text-sm text-gray-700">
                Do you need a loan?
              </label>
            </div>
          </div>


        </div>
      )}
    </div>
  );
} 