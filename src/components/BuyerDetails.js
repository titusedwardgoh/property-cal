import { useState, useEffect } from 'react';
import useFormNavigation from './shared/FormNavigation.js';
import { formatCurrency } from '../states/shared/baseCalculations.js';

export default function BuyerDetails({ formData, updateFormData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // If moving from question 5 (loan need) and no loan is needed, skip to completion
      if (currentStep === 5 && formData.needsLoan === 'no') {
        updateFormData('buyerDetailsComplete', true);
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      // Form is complete
      updateFormData('buyerDetailsComplete', true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    // Go back to PropertyDetails question 5
    updateFormData('propertyDetailsComplete', false);
    // Set PropertyDetails to show question 5
    updateFormData('propertyDetailsCurrentStep', 5);
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.buyerType && formData.buyerType.trim() !== '';
      case 2:
        return formData.isPPR && formData.isPPR.trim() !== '';
      case 3:
        return formData.isAustralianResident && formData.isAustralianResident.trim() !== '';
      case 4:
        return formData.isFirstHomeBuyer && formData.isFirstHomeBuyer.trim() !== '';
      case 5:
        return formData.needsLoan && formData.needsLoan.trim() !== '';
      case 6:
        return formData.needsLoan === 'yes' ? (formData.savingsAmount && formData.savingsAmount.trim() !== '') : true;
      default:
        return false;
    }
  };

  // Use shared navigation hook
  useFormNavigation({
    currentStep,
    totalSteps,
    isCurrentStepValid,
    onNext: nextStep,
    onPrev: prevStep,
    onComplete: () => {
      // Handle form completion
      updateFormData('buyerDetailsComplete', true);
    },
    onBack: handleBack,
    isComplete: false
  });

  const renderStep = () => {
    // Show completion message if form is complete
    if (formData.buyerDetailsComplete) {
      return (
        <div className="flex flex-col mt-12 pr-2">
          <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
            Buyer Details Complete
          </h2>
          <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
            Now let&apos;s calculate your costs...
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Are you an Owner or Investor?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              This affects your eligibility for concessions and grants
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'owner-occupier', label: 'Owner-Occupier', description: 'You will live in this property' },
                { value: 'investor', label: 'Investor', description: 'You will rent this property out' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('buyerType', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.buyerType === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.buyerType === option.value || 
                    formData.isPPR === option.value || 
                    formData.isAustralianResident === option.value || 
                    formData.isFirstHomeBuyer === option.value || 
                    formData.needsLoan === option.value
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}>{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Will you live in this property?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              This affects your eligibility for principal place of residence (PPR) concessions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'This will be my main home' },
                { value: 'no', label: 'No', description: 'This will not be my main home' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('isPPR', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.isPPR === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.buyerType === option.value || 
                    formData.isPPR === option.value || 
                    formData.isAustralianResident === option.value || 
                    formData.isFirstHomeBuyer === option.value || 
                    formData.needsLoan === option.value
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}>{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Australian citizen or permanent resident?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Residents may have additional concessions and foreigners additional duties
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'Australian citizen or permanent resident' },
                { value: 'no', label: 'No, I reside overseas', description: 'Foreign buyer' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('isAustralianResident', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.isAustralianResident === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.buyerType === option.value || 
                    formData.isPPR === option.value || 
                    formData.isAustralianResident === option.value || 
                    formData.isFirstHomeBuyer === option.value || 
                    formData.needsLoan === option.value
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}>{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Is this your first home purchase?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              First home buyers may have additional concessions and grants.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'This is my first home purchase' },
                { value: 'no', label: 'No', description: 'I have owned property before' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('isFirstHomeBuyer', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.isFirstHomeBuyer === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.buyerType === option.value || 
                    formData.isPPR === option.value || 
                    formData.isAustralianResident === option.value || 
                    formData.isFirstHomeBuyer === option.value || 
                    formData.needsLoan === option.value
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}>{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Do you need a loan to purchase?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              This affects your loan calculations and costs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I need a loan to purchase' },
                { value: 'no', label: 'No', description: 'I will pay cash' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('needsLoan', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.needsLoan === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.buyerType === option.value || 
                    formData.isPPR === option.value || 
                    formData.isAustralianResident === option.value || 
                    formData.isFirstHomeBuyer === option.value || 
                    formData.needsLoan === option.value
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}>{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto pr-2">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                How much savings do you have?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                This helps us calculate your loan amount and upfront costs
              </p>
              <div className="max-w-md mx-auto relative pr-8">
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none ${
                  formData.savingsAmount ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  $
                </div>
                <input
                  type="tel"
                  placeholder="0"
                  value={formData.savingsAmount ? formatCurrency(parseInt(formData.savingsAmount)).replace('$', '') : ''}
                  onChange={(e) => {
                    // Remove all non-digit characters and update form data
                    const numericValue = e.target.value.replace(/[^\d]/g, '');
                    updateFormData('savingsAmount', numericValue);
                  }}
                  className="w-full pl-8 pr-8 py-2 text-2xl border-b-2 border-gray-200 rounded-none focus:border-secondary focus:outline-none transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-base-100 rounded-lg overflow-hidden mt-15">
      <div className="flex">
        <span className={`text-xs font-extrabold mr-2 pt-14 whitespace-nowrap ${
          formData.buyerDetailsComplete ? 'text-base-100' : 'text-primary'
        }`}>
          <span className="text-xs text-base-100">1</span>
          {formData.buyerDetailsComplete ? '6' : currentStep + 5} 
          <span className={`text-xs ${formData.buyerDetailsComplete ? 'text-primary' : ''}`}>→</span>
        </span>
        <div className="pb-6 md:p-8 pb-24 md:pb-8 flex">
          {/* Step Content */}
          <div className="h-80">
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Navigation - Fixed bottom on mobile, normal position on desktop */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-base-100 md:bg-transparent pt-0 pr-4 pb-4 pl-4 md:p-0 md:mt-8 md:px-6 md:pb-8">
        {/* Progress Bar - Now IS the top border */}
        <div className="w-full bg-gray-100 h-1">
          <div 
            className="bg-primary h-1"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between max-w-4xl mx-auto mt-4">
          {formData.buyerDetailsComplete ? (
            // Completion state: Back and Next buttons
            <>
              <button
                onClick={() => {
                  updateFormData('buyerDetailsComplete', false);
                  // Go back to the last question and reset completion state
                  if (formData.needsLoan === 'yes') {
                    setCurrentStep(6); // Go back to savings question
                  } else {
                    setCurrentStep(5); // Go back to loan question
                  }
                }}
                className="bg-primary px-6 py-3 rounded-full border border-primary text-base font-medium border-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm flex-shrink-0 cursor-pointer"
              >
                &lt;
              </button>
              
              <button
                onClick={() => {
                  // Move to next section or complete the entire form
                  updateFormData('allFormsComplete', true);
                }}
                className="flex-1 ml-4 px-6 py-3 rounded-full border border-primary bg-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm text-base font-medium cursor-pointer"
              >
                Next
              </button>
            </>
          ) : currentStep === 1 ? (
            // Step 1: Back to PropertyDetails and Next buttons
            <>
              <button
                onClick={handleBack}
                className="bg-primary px-6 py-3 rounded-full border border-primary text-base font-medium border-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm flex-shrink-0 cursor-pointer"
              >
                &lt;
              </button>
              
              <button
                onClick={nextStep}
                disabled={!isCurrentStepValid()}
                className="flex-1 ml-4 px-6 py-3 rounded-full border border-primary bg-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm text-base font-medium cursor-pointer"
              >
                OK
              </button>
            </>
          ) : (
            // Step 2 onwards: Back and Next buttons
            <>
              <button
                onClick={prevStep}
                className="bg-primary px-6 py-3 rounded-full border border-primary text-base font-medium border-primary text-base hover:bg-primary hover:text-base-100 hover:border-primary hover:shadow-sm flex-shrink-0 cursor-pointer"
              >
                &lt;
              </button>
              
              <button
                onClick={nextStep}
                disabled={!isCurrentStepValid()}
                className={`flex-1 ml-4 px-6 py-3 bg-primary rounded-full border text-base font-medium ${
                  !isCurrentStepValid()
                    ? 'border-primary text-base-100 cursor-not-allowed bg-gray-50'
                    : 'border-primary bg-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm cursor-pointer'
                }`}
              >
                {currentStep === totalSteps ? 'Complete' : 'OK'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
