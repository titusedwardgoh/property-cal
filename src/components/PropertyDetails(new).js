import { useState } from 'react';

export default function PropertyDetailsNew({ formData, updateFormData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('forward'); // 'forward' or 'backward'
  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setDirection('forward');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection('backward');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 150);
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
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                What is the property&apos;s price?
              </h2>
              <p className=" md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                This will help us calculate your stamp duty and other costs
              </p>
              <div className="max-w-md mx-auto relative pr-8">
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none ${
                  formData.propertyPrice ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  $
                </div>
                <input
                  type="text"
                  placeholder="0"
                  value={formData.propertyPrice ? Number(formData.propertyPrice).toLocaleString() : ''}
                  onChange={(e) => {
                    // Remove all non-digit characters and update form data
                    const numericValue = e.target.value.replace(/[^\d]/g, '');
                    updateFormData('propertyPrice', numericValue);
                  }}
                  className="w-full pl-8 pr-8 py-2 text-2xl border-b-2 border-gray-200 rounded-none focus:border-secondary focus:outline-none transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                What&apos;s the property address?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                This helps us determine the state and provide more accurate calculations
              </p>
              <div className="max-w-md mx-auto relative pr-8">
                <input
                  type="text"
                  placeholder="Enter street address"
                  value={formData.propertyAddress || ''}
                  onChange={(e) => updateFormData('propertyAddress', e.target.value)}
                  className="w-full pl-8 pr-8 py-2 text-2xl border-b-2 border-gray-200 rounded-none focus:border-secondary focus:outline-none transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Which state is the property in?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Different states have different stamp duty rates and concessions
            </p>
            <div className="max-w-md relative pr-8">
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'].map((state) => (
                  <button
                    key={state}
                    onClick={() => updateFormData('selectedState', state)}
                    className={`px-3 py-2 text-base font-medium rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                      formData.selectedState === state
                        ? 'border-gray-800 bg-gray-800 text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
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
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                What type of property is it?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                This affects your stamp duty concessions and ongoing costs
              </p>
              <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
                {[
                  { value: 'house', label: 'House' },
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'townhouse', label: 'Townhouse' },
                  { value: 'land', label: 'Land' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('propertyCategory', option.value)}
                    className={`p-8 rounded-lg border-2 transition-all duration-200 text-center flex items-center justify-center hover:scale-105 ${
                      formData.propertyCategory === option.value
                        ? 'border-gray-800 bg-gray-800 text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-medium text-center">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                Is this a new or existing property?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                New properties may have different concessions and costs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { value: 'existing', label: 'Existing Property', description: 'Already built and lived in' },
                  { value: 'new', label: 'New Property', description: 'Recently built, never lived in' },
                  { value: 'off-the-plan', label: 'Off-the-Plan', description: 'Buying before construction' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('propertyType', option.value)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                      formData.propertyType === option.value
                        ? 'border-gray-800 bg-gray-800 text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xl font-medium mb-2">{option.label}</div>
                    <div className="text-base text-gray-500">{option.description}</div>
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
    <div className="bg-base-100 rounded-lg overflow-hidden mt-25">
      <div className="flex">
      <span className="text-primary text-xs font-extrabold mr-2 pt-14 whitespace-nowrap">{currentStep} <span className="text-xs">→</span></span>
      <div className="pb-6 md:p-8 pb-24 md:pb-8 flex">
        {/* Step Content */}
        <div className="h-80">
          {renderStep()}
        </div>
      </div>

      {/* Navigation - Fixed bottom on mobile, normal position on desktop */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-base-100 md:bg-transparent pt-0 pr-4 pb-4 pl-4 md:p-0 md:mt-8 md:px-6 md:pb-8">
        {/* Progress Bar - Now IS the top border */}
        <div className="w-full bg-gray-100 h-1">
          <div 
            className="bg-primary h-1 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between max-w-4xl mx-auto mt-4">
          {currentStep === 1 ? (
            // Step 1: Full width OK button
            <button
              onClick={nextStep}
              disabled={!isCurrentStepValid()}
              className={`w-full px-6 py-3 rounded-full border transition-all duration-300 ease-in-out text-base font-medium ${
                !isCurrentStepValid()
                  ? 'border-primary text-base-100 cursor-not-allowed bg-primary'
                  : 'border-primary bg-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm'
              }`}
            >
              OK
            </button>
          ) : (
            // Step 2 onwards: Back and Next buttons with smooth transition
            <>
              <button
                onClick={prevStep}
                className={`bg-primary px-6 py-3 rounded-full border border-primary transition-all duration-300 ease-in-out text-base font-medium border-primary text-base hover:bg-primary hover:text-base-100 hover:border-primary hover:shadow-sm flex-shrink-0 ${
                  isTransitioning && direction === 'backward' ? 'transform translate-x-4 opacity-0' : 
                  isTransitioning && direction === 'forward' ? 'transform -translate-x-4 opacity-0' : 
                  'transform translate-x-0 opacity-100'
                }`}
              >
                &lt;
              </button>
              
              <button
                onClick={nextStep}
                disabled={!isCurrentStepValid()}
                className={`flex-1 ml-4 px-6 py-3 rounded-full border transition-all duration-300 ease-in-out text-base font-medium ${
                  !isCurrentStepValid()
                    ? 'border-primary text-gray-300 cursor-not-allowed bg-gray-50'
                    : 'border-primary bg-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm'
                }`}
              >
                {currentStep === totalSteps ? 'Complete' : 'OK'}
              </button>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
