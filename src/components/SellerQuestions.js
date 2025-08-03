import React, { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function SellerQuestions({
  price,
  propertyData,
  setPropertyData,
  includeBodyCorporate,
  setIncludeBodyCorporate,
  bodyCorporate,
  setBodyCorporate,
  councilRates,
  setCouncilRates,
  waterRates,
  setWaterRates
}) {
  const [isSellerQuestionsExpanded, setIsSellerQuestionsExpanded] = useState(false);

  // Only show when property price has been entered
  if (!price || price <= 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Other Things to Ask the Seller</h2>
          </div>
          <button
            onClick={() => setIsSellerQuestionsExpanded(!isSellerQuestionsExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={true}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Enter property price to see seller questions
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Other Things to Ask the Seller</h2>
        </div>
        <button
          onClick={() => setIsSellerQuestionsExpanded(!isSellerQuestionsExpanded)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isSellerQuestionsExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {isSellerQuestionsExpanded && (
        <div className="space-y-4">
          {/* Council Rates - Always shown, no checkbox */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Council Rates
                </label>
                <p className="text-xs text-gray-600">
                  Annual council rates for the property
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">$</span>
                                                             <input
                   type="number"
                   value={councilRates || ''}
                   onChange={(e) => {
                     const value = e.target.value;
                     setCouncilRates(value === '' ? 0 : Number(value));
                   }}
                   className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                   placeholder="0"
                 />
            </div>
          </div>

          {/* Water Rates - Always shown, no checkbox */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Water Rates
                </label>
                <p className="text-xs text-gray-600">
                  Annual water rates and service charges
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">$</span>
                                                             <input
                   type="number"
                   value={waterRates || ''}
                   onChange={(e) => {
                     const value = e.target.value;
                     setWaterRates(value === '' ? 0 : Number(value));
                   }}
                   className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                   placeholder="0"
                 />
            </div>
          </div>

          {/* Body Corporate/Strata - Checkbox with default for apartments */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="bodyCorporate"
                checked={includeBodyCorporate}
                onChange={(e) => setIncludeBodyCorporate(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <label htmlFor="bodyCorporate" className="text-sm font-medium text-gray-900">
                  Body Corporate/Strata
                </label>
                <p className="text-xs text-gray-600">
                  Annual body corporate or strata fees
                </p>
              </div>
            </div>
            {includeBodyCorporate && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">$</span>
                <input
                  type="number"
                  value={bodyCorporate || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBodyCorporate(value === '' ? 0 : Number(value));
                  }}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            )}
          </div>

          {/* Off-the-Plan specific fields - Only show if property type is off-the-plan */}
          {propertyData.propertyType === 'off-the-plan' && (
            <>
              {/* Estimated Completion Year */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Estimated Completion Year
                    </label>
                    <p className="text-xs text-gray-600">
                      When will the property be ready for settlement?
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={propertyData.completionYear || ''}
                    onChange={(e) => setPropertyData({
                      ...propertyData,
                      completionYear: e.target.value ? Number(e.target.value) : null
                    })}
                    className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Construction Started */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Construction Status
                    </label>
                    <p className="text-xs text-gray-600">
                      Has construction already started on the property?
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="constructionStarted"
                    checked={propertyData.constructionStarted}
                    onChange={(e) => setPropertyData({
                      ...propertyData,
                      constructionStarted: e.target.checked
                    })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="constructionStarted" className="text-sm text-gray-700">
                    Construction has started
                  </label>
                </div>
              </div>

              {/* Development Completion % - Only show if construction has started */}
              {propertyData.constructionStarted && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Development Completion %
                      </label>
                      <p className="text-xs text-gray-600">
                        What percentage of the development is completed?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={propertyData.developmentCompletion || ''}
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        developmentCompletion: e.target.value ? Number(e.target.value) : null
                      })}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
              )}

              {/* Dutiable Value - Only show if construction has started */}
              {propertyData.constructionStarted && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Dutiable Value of Property
                      </label>
                      <p className="text-xs text-gray-600">
                        What is the current dutiable value of the property?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">$</span>
                    <input
                      type="number"
                      value={propertyData.dutiableValue || ''}
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        dutiableValue: e.target.value ? Number(e.target.value) : null
                      })}
                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 