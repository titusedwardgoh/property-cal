import { useState, useEffect } from 'react';
import useFormNavigation from './shared/FormNavigation.js';
import { useFormStore } from '../stores/formStore';

export default function LoanDetails() {
  const formData = useFormStore();
  const updateFormData = useFormStore(state => state.updateFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

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
    // Set BuyerDetails to show the last question
    updateFormData('buyerDetailsCurrentStep', 6);
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.loanQuestion1 && formData.loanQuestion1.trim() !== '';
      case 2:
        return formData.loanQuestion2 && formData.loanQuestion2.trim() !== '';
      case 3:
        return formData.loanQuestion3 && formData.loanQuestion3.trim() !== '';
      case 4:
        return formData.loanQuestion4 && formData.loanQuestion4.trim() !== '';
      case 5:
        return formData.loanQuestion5 && formData.loanQuestion5.trim() !== '';
      case 6:
        return formData.loanQuestion6 && formData.loanQuestion6.trim() !== '';
      case 7:
        return formData.loanQuestion7 && formData.loanQuestion7.trim() !== '';
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
      updateFormData('loanDetailsComplete', true);
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
            Now let's ask a few questions about the seller...
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Loan Question 1
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Placeholder question for now
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I am a placeholder' },
                { value: 'no', label: 'No', description: 'I am not a placeholder' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('loanQuestion1', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.loanQuestion1 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.loanQuestion1 === option.value
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
              Loan Question 2
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Placeholder question for now
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I am a placeholder' },
                { value: 'no', label: 'No', description: 'I am not a placeholder' }
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
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Loan Question 3
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Placeholder question for now
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I am a placeholder' },
                { value: 'no', label: 'No', description: 'I am not a placeholder' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('loanQuestion3', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.loanQuestion3 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.loanQuestion3 === option.value
                      ? 'text-gray-300'
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
              Loan Question 4
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Placeholder question for now
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I am a placeholder' },
                { value: 'no', label: 'No', description: 'I am not a placeholder' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('loanQuestion4', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.loanQuestion4 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.loanQuestion4 === option.value
                      ? 'text-gray-300'
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
              Loan Question 5
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Placeholder question for now
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I am a placeholder' },
                { value: 'no', label: 'No', description: 'I am not a placeholder' }
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
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Loan Question 6
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Placeholder question for now
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I am a placeholder' },
                { value: 'no', label: 'No', description: 'I am not a placeholder' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('loanQuestion6', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.loanQuestion6 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.loanQuestion6 === option.value
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}>{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Loan Question 7
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Placeholder question for now
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mb-8">
              {[
                { value: 'yes', label: 'Yes', description: 'I am a placeholder' },
                { value: 'no', label: 'No', description: 'I am not a placeholder' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('loanQuestion7', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.loanQuestion7 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.loanQuestion7 === option.value
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}>{option.description}</div>
                </button>
              ))}
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
        <span className="text-xs font-extrabold mr-2 pt-14 whitespace-nowrap text-primary">
          <span className="text-xs text-base-100">3</span>
          {formData.loanDetailsComplete ? '18' : currentStep + 11} 
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
