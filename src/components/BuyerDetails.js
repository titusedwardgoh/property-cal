import React from 'react';
import { User } from 'lucide-react';

export default function BuyerDetails({
  needsLoan,
  setNeedsLoan,
  includeOtherFees,
  setIncludeOtherFees,
  isForeignBuyer,
  setIsForeignBuyer,
  isFirstHomeBuyer,
  setIsFirstHomeBuyer,
  isSearching,
  propertyPrice
}) {
  // Don't show buyer details until property price is entered
  if (!propertyPrice || propertyPrice <= 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900 capitalize">A bit about You</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeOtherFees"
            checked={includeOtherFees}
            onChange={(e) => setIncludeOtherFees(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={isSearching}
          />
          <label htmlFor="includeOtherFees" className="text-sm text-gray-700">
            Other fees
          </label>
        </div>
      </div>
    </div>
  );
} 