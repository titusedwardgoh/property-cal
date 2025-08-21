import { useState, useEffect } from 'react';
import useFormNavigation from './shared/FormNavigation.js';
import { useFormStore } from '../stores/formStore';
import { formatCurrency } from '../states/shared/baseCalculations.js';

export default function LoanDetails() {
  const formData = useFormStore();
  const updateFormData = useFormStore(state => state.updateFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Calculate the starting step number based on WA and ACT selection
  const getStartingStepNumber = () => {
    const isWA = formData.selectedState === 'WA';
    const isACT = formData.selectedState === 'ACT';
    
    if (isWA) {
      // WA: PropertyDetails (6) + BuyerDetails starts at (7) + 7 steps = 14
      return 14;
    } else if (isACT) {
      // ACT: PropertyDetails (5) + BuyerDetails starts at (6) + 8 steps = 14
      return 14;
    } else {
      // Non-WA/ACT: PropertyDetails (5) + BuyerDetails starts at (6) + 7 steps = 13
      return 13;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      // Form is complete
      updateFormData('loanDetailsComplete', true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    // Go back to BuyerDetails last question
    updateFormData('buyerDetailsComplete', false);
    // Reset the navigation flags to ensure proper flow
    updateFormData('showLoanDetails', false);
    updateFormData('showSellerQuestions', false);
    // Set BuyerDetails to show the last question (step 7, which is question 12)
    updateFormData('buyerDetailsCurrentStep', 7);
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.loanQuestion1 && parseInt(formData.loanQuestion1) > 0;
      case 2:
        return formData.loanQuestion2 && formData.loanQuestion2.trim() !== '';
      case 3:
        return formData.loanQuestion3 && parseInt(formData.loanQuestion3) >= 1 && parseInt(formData.loanQuestion3) <= 30;
      case 4:
        return formData.loanQuestion4 && parseFloat(formData.loanQuestion4) >= 0.01 && parseFloat(formData.loanQuestion4) <= 20;
      case 5:
        return formData.loanQuestion5 && formData.loanQuestion5.trim() !== '';
      case 6:
        return formData.loanQuestion6 && parseFloat(formData.loanQuestion6) >= 0;
      case 7:
        return formData.loanQuestion7 && parseFloat(formData.loanQuestion7) >= 0;
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
      if (formData.loanDetailsComplete) {
        // We're on the completion page, move to next section
        updateFormData('showSellerQuestions', true);
      } else {
        // Handle form completion
        updateFormData('loanDetailsComplete', true);
      }
    },
    onBack: handleBack,
    isComplete: formData.loanDetailsComplete
  });

  // Watch for loanDetailsCurrentStep flag from SellerQuestions
  useEffect(() => {
    if (formData.loanDetailsCurrentStep) {
      setCurrentStep(formData.loanDetailsCurrentStep);
      // Reset the flag
      updateFormData('loanDetailsCurrentStep', null);
      // Ensure we're not in completion state when going back to a specific question
      if (formData.loanDetailsComplete) {
        updateFormData('loanDetailsComplete', false);
      }
      // Don't reset showLoanDetails - we want to stay on this component
      // Only reset showSellerQuestions to ensure proper flow
      updateFormData('showSellerQuestions', false);
    }
  }, [formData.loanDetailsCurrentStep, updateFormData, formData.loanDetailsComplete]);

  const renderStep = () => {
    // Show completion message if form is complete
    if (formData.loanDetailsComplete) {
      return (
        <div className="flex flex-col mt-12 pr-2">
          <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
            Loan Details Complete
          </h2>
          <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
            Now let&apos;s ask a few additional questions which you can get ask the seller...
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto pr-2">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                What is your deposit amount?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                This will help us calculate your loan amount and LMI requirements
              </p>
              <div className="max-w-md mx-auto relative pr-8">
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none ${
                  formData.loanQuestion1 ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  $
                </div>
                <input
                  type="tel"
                  placeholder="0"
                  value={formData.loanQuestion1 ? formatCurrency(parseInt(formData.loanQuestion1)).replace('$', '') : ''}
                  onChange={(e) => {
                    // Remove all non-digit characters and update form data
                    const numericValue = e.target.value.replace(/[^\d]/g, '');
                    updateFormData('loanQuestion1', numericValue);
                  }}
                  className="w-full pl-8 pr-8 py-2 text-2xl border-b-2 border-gray-200 rounded-none focus:outline-none transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              What type of loan do you need?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              This affects your monthly payments and loan structure
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'principal-and-interest', label: 'Principal and Interest', description: 'Pay both principal and interest each month' },
                { value: 'interest-only', label: 'Interest Only', description: 'Pay only interest for a set period' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('loanQuestion2', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.loanQuestion2 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.loanQuestion2 === option.value
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}>{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto pr-2">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                How long do you want your mortgage for?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                Enter the number of years for your loan (1-30 years)
              </p>
              <div className="max-w-md mx-auto relative">
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  placeholder="30"
                  value={formData.loanQuestion3 || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 30) {
                      updateFormData('loanQuestion3', value.toString());
                    } else if (e.target.value === '') {
                      updateFormData('loanQuestion3', '');
                    }
                  }}
                  className="w-full px-6 py-2 text-2xl border-b-2 border-gray-200 rounded-none focus:outline-none transition-all duration-200 hover:border-gray-300 text-center"
                />
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 pointer-events-none">
                  years
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto pr-2">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                What interest rate is your bank offering you?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                Enter the annual interest rate percentage for your loan
              </p>
              <div className="max-w-md mx-auto relative">
                <input
                  type="number"
                  min="0.01"
                  max="20"
                  step="0.01"
                  placeholder="6"
                  value={formData.loanQuestion4 || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0.01 && value <= 20) {
                      updateFormData('loanQuestion4', value.toString());
                    } else if (e.target.value === '') {
                      updateFormData('loanQuestion4', '');
                    }
                  }}
                  className="w-full px-6 py-2 text-2xl border-b-2 border-gray-200 rounded-none focus:outline-none transition-all duration-200 hover:border-gray-300 text-center"
                />
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 pointer-events-none">
                  %
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Do you need Lenders Mortgage Insurance?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              LMI is typically required when your deposit is less than 20% of the property value
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I need LMI coverage' },
                { value: 'no', label: 'No', description: 'I don\'t need LMI coverage' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('loanQuestion5', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.loanQuestion5 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.loanQuestion5 === option.value
                      ? 'text-gray-300'
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
                Bank usually charge a Settlement Fee
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                Fee charged by the bank for settlement processing
              </p>
              <div className="max-w-md mx-auto relative pr-8">
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none ${
                  formData.loanQuestion6 ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  $
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="200"
                  value={formData.loanQuestion6 || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0) {
                      updateFormData('loanQuestion6', value.toString());
                    } else if (e.target.value === '') {
                      updateFormData('loanQuestion6', '');
                    }
                  }}
                  className="w-full pl-8 pr-8 py-2 text-2xl border-b-2 border-gray-200 rounded-none focus:outline-none transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="h-full flex flex-col justify-center items-center bg-base-100">
            <div className="max-w-2xl mx-auto pr-2">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight flex items-center justify-center">
                Loan Establishment Fee
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                Fee charged by the bank for setting up your loan
              </p>
              <div className="max-w-md mx-auto relative pr-8">
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none ${
                  formData.loanQuestion7 ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  $
                </div>
                                 <input
                   type="number"
                   min="0"
                   step="0.01"
                   placeholder="600"
                   value={formData.loanQuestion7 || ''}
                   onChange={(e) => {
                     const value = parseFloat(e.target.value);
                     if (value >= 0) {
                       updateFormData('loanQuestion7', value.toString());
                     } else if (e.target.value === '') {
                       updateFormData('loanQuestion7', '');
                     }
                   }}
                   className="w-full pl-8 pr-8 py-2 text-2xl border-b-2 border-gray-200 rounded-none focus:outline-none transition-all duration-200 hover:border-gray-300"
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
        <span className={`text-xs font-extrabold mr-2 pt-14 whitespace-nowrap ${formData.loanDetailsComplete ? 'text-base-100' : 'text-primary'}`}>
          <span className="text-xs text-base-100">{formData.needsLoan === 'yes' ? '3' : '2'}</span>{formData.loanDetailsComplete ? (getStartingStepNumber() + totalSteps - 1) : (currentStep + getStartingStepNumber() - 1)} 
          <span className={`text-xs ${formData.loanDetailsComplete ? 'text-primary' : ''}`}>→</span>
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
          {formData.loanDetailsComplete ? (
            // Completion state: Back to Q7 and Next to SellerQuestions
            <>
              <button
                onClick={() => {
                  updateFormData('loanDetailsComplete', false);
                  setCurrentStep(7);
                }}
                className="bg-primary px-6 py-3 rounded-full border border-primary text-base font-medium hover:bg-primary hover:border-gray-700 hover:shadow-sm flex-shrink-0 cursor-pointer"
              >
                &lt;
              </button>
              
              <button
                onClick={() => updateFormData('showSellerQuestions', true)}
                className="flex-1 ml-4 px-6 py-3 bg-primary rounded-full border border-primary text-base font-medium hover:bg-primary hover:border-gray-700 hover:shadow-sm cursor-pointer"
              >
                Next
              </button>
            </>
          ) : currentStep === 1 ? (
            // Step 1: Back to BuyerDetails and Next buttons
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
