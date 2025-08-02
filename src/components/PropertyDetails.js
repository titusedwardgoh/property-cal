import { MapPin, Search, TrendingUp, Loader2, Building } from 'lucide-react';
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
  onAddressSearch
}) {
  const isOffThePlan = propertyData.propertyType === 'off-the-plan';
  const isExistingProperty = propertyData.propertyType === 'existing';

  // Reset useEstimatedPrice when switching to off-the-plan
  const handlePropertyTypeChange = (newType) => {
    setPropertyData(prev => ({ ...prev, propertyType: newType }));
    if (newType === 'off-the-plan') {
      setUseEstimatedPrice(false); // Force manual entry for off-the-plan
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
      </div>

      {/* Property Type Selection */}
      <div className="mb-6">
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
              Off-the-Plan
            </label>
          </div>
        </div>
      </div>

      {/* Property Category Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Category <span className="text-red-500">*</span>
        </label>
        <select
          value={propertyData.propertyCategory || ''}
          onChange={(e) => setPropertyData(prev => ({ ...prev, propertyCategory: e.target.value }))}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
            !propertyData.propertyCategory ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSearching}
          required
        >
          <option value="">Select property category...</option>
          <option value="house">House</option>
          <option value="townhouse">Townhouse</option>
          <option value="apartment">Apartment/Unit</option>
          <option value="land">Land</option>
        </select>
        {!propertyData.propertyCategory && (
          <p className="mt-1 text-sm text-red-600">
            Please select a property category
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isOffThePlan ? 'Address' : 'Property Address'}
            {isExistingProperty && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={propertyData.address}
              onChange={(e) => setPropertyData(prev => ({ ...prev, address: e.target.value }))}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={isOffThePlan ? "Suburb or lot number..." : "Enter property address..."}
              disabled={isSearching}
              required={isExistingProperty}
            />
            {isExistingProperty && (
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
            )}
          </div>
          {isOffThePlan && (
            <p className="text-xs text-gray-500 mt-1">
              For new developments, a suburb or lot number is enough.
            </p>
          )}
          {searchError && (
            <p className="text-red-600 text-sm mt-2">{searchError}</p>
          )}
          {isSearching && (
            <p className="text-blue-600 text-sm mt-2">Searching for property data...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Territory
          </label>
          <select
            value={propertyData.state}
            onChange={(e) => setPropertyData(prev => ({ ...prev, state: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isSearching}
          >
            {STATE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Property Price
              {isOffThePlan && <span className="text-red-500 ml-1">*</span>}
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
              required={isOffThePlan}
            />
          )}
        </div>

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
    </div>
  );
} 