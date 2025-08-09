import React, { useState } from 'react';
import { MapPin, Search, TrendingUp, Loader2, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { STATE_OPTIONS } from '../data/constants.js';
import { formatCurrency } from '../utils/calculations.js';

export default function PropertyDetails({ 
  propertyData, 
  setPropertyData, 
  loanDetails, 
  setLoanDetails,
  useEstimatedPrice,
  setUseEstimatedPrice,
  isSearching,
  searchError,
  onAddressSearch,
  isInvestor,
  isForeignBuyer,
  isFirstHomeBuyer,
  needsLoan,
  savingsAmount
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOffThePlan = propertyData.propertyType === 'off-the-plan';
  const isExistingProperty = propertyData.propertyType === 'existing';
  
  // Check if all buyer details questions have been answered
  const allBuyerDetailsAnswered = isInvestor !== null && 
                                 isForeignBuyer !== null && 
                                 isFirstHomeBuyer !== null && 
                                 needsLoan !== null &&
                                 (needsLoan === false || (needsLoan === true && savingsAmount > 0));

  // Reset useEstimatedPrice when switching to off-the-plan
  const handlePropertyTypeChange = (newType) => {
    setPropertyData(prev => ({ ...prev, propertyType: newType }));
    if (newType === 'off-the-plan') {
      setUseEstimatedPrice(false); // Force manual entry for off-the-plan
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg transition-colors ${
            allBuyerDetailsAnswered 
              ? 'hover:bg-gray-100' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={isSearching || !allBuyerDetailsAnswered}
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
          {/* Property Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Property Type
            </label>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="existing"
                  name="propertyType"
                  value="existing"
                  checked={isExistingProperty}
                  onChange={(e) => handlePropertyTypeChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="existing" className="ml-2 text-sm text-gray-700">
                  Existing Property
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="off-the-plan"
                  name="propertyType"
                  value="off-the-plan"
                  checked={isOffThePlan}
                  onChange={(e) => handlePropertyTypeChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <label htmlFor="off-the-plan" className="ml-2 text-sm text-gray-700">
                  New Home / Off-the-Plan
                </label>
              </div>
            </div>
            
            {/* Foreign Buyer Alert for Existing Property */}
            {isForeignBuyer && isExistingProperty && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Foreign buyer restriction</p>
                    <p>Foreign buyers can only purchase established dwellings in limited circumstances.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Property Address and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address
                {isExistingProperty && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={propertyData.address}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, address: e.target.value }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter property address..."
                  disabled={isSearching}
                  required={isExistingProperty}
                />
                <button
                  onClick={onAddressSearch}
                  disabled={isSearching || !propertyData.address.trim()}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>
              {searchError && (
                <p className="text-red-600 text-sm mt-2">{searchError}</p>
              )}
              {isSearching && (
                <p className="text-blue-600 text-sm mt-2">Searching for property data...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Territory <span className="text-red-500">*</span>
              </label>
              <select
                value={propertyData.state}
                onChange={(e) => setPropertyData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isSearching}
                required
              >
                <option value="">Select</option>
                {STATE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
              {/* Property Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={propertyData.propertyCategory || ''}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, propertyCategory: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white border-gray-300
                  `}
                  disabled={isSearching}
                  required
                >
                  <option value="">Select property category...</option>
                  <option value="house">House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="apartment">Apartment/Unit</option>
                  <option value="land">Land</option>
                </select>
              </div>

          {/* Property Price */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {propertyData.propertyCategory === 'land' ? 'Land Price' : 'Property Price'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              {isExistingProperty && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useEstimate"
                    checked={useEstimatedPrice}
                    onChange={(e) => setUseEstimatedPrice(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSearching}
                  />
                  <label htmlFor="useEstimate" className="text-sm text-gray-600">
                    Use estimate
                  </label>
                </div>
              )}
            </div>
            {useEstimatedPrice && isExistingProperty ? (
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Estimated: {formatCurrency(propertyData.estimatedPrice || 0)}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">Based on local comparables</p>
              </div>
            ) : (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={propertyData.price || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPropertyData(prev => ({ ...prev, price: value ? Number(value) : 0 }));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter property price..."
                disabled={isSearching}
                required
              />
            )}
          </div>


          {/* Estimated Build Cost - Only show for land */}
          {propertyData.propertyCategory === 'land' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Build Cost
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={propertyData.estimatedBuildCost !== undefined && propertyData.estimatedBuildCost !== null ? propertyData.estimatedBuildCost : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPropertyData(prev => ({ ...prev, estimatedBuildCost: value ? Number(value) : null }));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter estimated build cost..."
                disabled={isSearching}
              />
            </div>
          )}

          {/* Vacant Land Concession Checkbox - Only show for QLD land with build cost */}
          {propertyData.state === 'QLD' && propertyData.propertyCategory === 'land' && (
            <div>
              <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <input
                  type="checkbox"
                  id="claimVacantLandConcession"
                  checked={propertyData.claimVacantLandConcession || false}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, claimVacantLandConcession: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  disabled={isSearching}
                />
                <div>
                  <label htmlFor="claimVacantLandConcession" className="text-sm font-medium text-blue-900">
                    Claim Vacant Land Concession
                  </label>
                  <p className="text-xs text-blue-700 mt-1">
                    If checked, stamp duty will be $0 with no price caps for Queensland vacant land purchases
                  </p>
                </div>
              </div>
            </div>
          )}



          {/* Western Australia Metro Region - Only show for WA first home buyers who are PPR */}
          {propertyData.state === 'WA' && isFirstHomeBuyer && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                WA Metro Region <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="wa-metro"
                    name="waMetroRegion"
                    value="metropolitan"
                    checked={propertyData.waMetroRegion === 'metropolitan'}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, waMetroRegion: e.target.value }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isSearching}
                    required
                  />
                  <label htmlFor="wa-metro" className="ml-2 text-sm text-gray-700">
                    Metro (Perth/Peel)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="wa-nonmetro"
                    name="waMetroRegion"
                    value="non-metropolitan"
                    checked={propertyData.waMetroRegion === 'non-metropolitan'}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, waMetroRegion: e.target.value }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isSearching}
                    required
                  />
                  <label htmlFor="wa-nonmetro" className="ml-2 text-sm text-gray-700">
                    Non-Metro
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Western Australia Region - Only show for WA */}
          {propertyData.state === 'WA' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Western Australia Region <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="wa-north"
                    name="waRegion"
                    value="north"
                    checked={propertyData.waRegion === 'north'}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, waRegion: e.target.value }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isSearching}
                    required
                  />
                  <label htmlFor="wa-north" className="ml-2 text-sm text-gray-700">
                    North
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="wa-south"
                    name="waRegion"
                    value="south"
                    checked={propertyData.waRegion === 'south'}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, waRegion: e.target.value }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isSearching}
                    required
                  />
                  <label htmlFor="wa-south" className="ml-2 text-sm text-gray-700">
                    South
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Off-the-Plan Specific Fields */}
          {isOffThePlan && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Development Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={propertyData.developerName || ''}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, developerName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., ABC Developments"
                  disabled={isSearching}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      {!allBuyerDetailsAnswered && (
        <div className="text-sm text-gray-600 mt-4">
          Complete buyer details first
        </div>
      )}
    </div>
  );
} 