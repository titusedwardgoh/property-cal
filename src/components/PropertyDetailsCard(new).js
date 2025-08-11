import { useState } from 'react';

export default function PropertyDetailsCard({ formData, updateFormData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Increased from 4 to 5

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyPrice && formData.propertyPrice.trim() !== '';
      case 2:
        return formData.propertyAddress && formData.propertyAddress.trim() !== '';
      case 3:
        return formData.selectedState && formData.selectedState.trim() !== '';
      case 4:
        return formData.propertyCategory && formData.propertyCategory.trim() !== '';
      case 5:
        return formData.propertyType && formData.propertyType.trim() !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="h-full flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🏘️ What's the property price?
              </h2>
              <p className="text-xl text-gray-600">
                This will help us calculate your stamp duty and other costs
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-sm mx-auto">
                <input
                  type="number"
                  placeholder="$0"
                  value={formData.propertyPrice}
                  onChange={(e) => updateFormData('propertyPrice', e.target.value)}
                  className="w-full px-6 py-4 text-3xl font-semibold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="h-full flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                📍 What's the property address?
              </h2>
              <p className="text-xl text-gray-600">
                This helps us determine the state and provide more accurate calculations
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Enter street address"
                  value={formData.propertyAddress || ''}
                  onChange={(e) => updateFormData('propertyAddress', e.target.value)}
                  className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <p className="text-base text-gray-500 mt-3 text-center">
                  Example: 123 Main Street, Sydney NSW
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="h-full flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🗺️ Which state is the property in?
              </h2>
              <p className="text-xl text-gray-600">
                Different states have different stamp duty rates and concessions
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                {['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'].map((state) => (
                  <button
                    key={state}
                    onClick={() => updateFormData('selectedState', state)}
                    className={`px-6 py-4 text-lg font-semibold rounded-lg border-2 transition-colors ${
                      formData.selectedState === state
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="h-full flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🏠 What type of property is it?
              </h2>
              <p className="text-xl text-gray-600">
                This affects your stamp duty concessions and ongoing costs
              </p>
            </div>
            <div className="flex-1"></div>
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { value: 'house', label: '🏡 House', description: 'Standalone house' },
                  { value: 'apartment', label: '🏢 Apartment', description: 'Unit or apartment' },
                  { value: 'townhouse', label: '🏘️ Townhouse', description: 'Attached townhouse' },
                  { value: 'land', label: '🌱 Land', description: 'Vacant land' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('propertyCategory', option.value)}
                    className={`p-5 rounded-lg border-2 transition-colors text-left ${
                      formData.propertyCategory === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-lg font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="h-full flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🆕 Is this a new or existing property?
              </h2>
              <p className="text-xl text-gray-600">
                New properties may have different concessions and costs
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                  { value: 'existing', label: '🏚️ Existing Property', description: 'Already built and lived in' },
                  { value: 'new', label: '🏗️ New Property', description: 'Recently built, never lived in' },
                  { value: 'off-the-plan', label: '📋 Off-the-Plan', description: 'Buying before construction' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('propertyType', option.value)}
                    className={`p-5 rounded-lg border-2 transition-colors text-left ${
                      formData.propertyType === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-lg font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-base text-gray-600 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content - Fixed Height */}
      <div className="h-80">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg border-2 transition-colors text-base font-medium ${
            currentStep === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          ← Back
        </button>
        
        <button
          onClick={nextStep}
          disabled={!isCurrentStepValid()}
          className={`px-6 py-3 rounded-lg border-2 transition-colors text-base font-medium ${
            !isCurrentStepValid()
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {currentStep === totalSteps ? 'Complete' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
