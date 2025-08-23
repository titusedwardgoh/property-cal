import { useState, useEffect, useCallback } from 'react';
import useFormNavigation from './shared/FormNavigation.js';
import { useFormStore } from '../stores/formStore';

export default function SellerQuestions() {
  const formData = useFormStore();
  const updateFormData = useFormStore(state => state.updateFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [localCompletionState, setLocalCompletionState] = useState(false);
  const totalSteps = 7;

  // Calculate the starting step number based on WA, ACT selection and loan need
  const getStartingStepNumber = () => {
    const isWA = formData.selectedState === 'WA';
    const isACT = formData.selectedState === 'ACT';
    const needsLoan = formData.needsLoan === 'yes';
    
    if (needsLoan) {
      // Loan path: PropertyDetails + BuyerDetails + LoanDetails
      if (isWA) {
        // WA: PropertyDetails (6) + BuyerDetails starts at (7) + 7 steps + LoanDetails (7) = 20
        return 21;
      } else if (isACT) {
        // ACT: PropertyDetails (5) + BuyerDetails starts at (6) + 8 steps + LoanDetails (7) = 20
        return 21;
      } else {
        // Non-WA/ACT: PropertyDetails (5) + BuyerDetails starts at (6) + 7 steps + LoanDetails (7) = 19
        return 20;
      }
    } else {
      // No loan path: PropertyDetails + BuyerDetails
      if (isWA) {
        // WA: PropertyDetails (6) + BuyerDetails starts at (7) + 7 steps = 13
        return 13;
      } else if (isACT) {
        // ACT: PropertyDetails (5) + BuyerDetails starts at (6) + 8 steps = 13
        return 13;
      } else {
        // Non-WA/ACT: PropertyDetails (5) + BuyerDetails starts at (6) + 7 steps = 12
        return 12;
      }
    }
  };

  const nextStep = useCallback(() => {
    // Initialize the store with current step if this is the first call
    if (currentStep === 1) {
      updateFormData('sellerQuestionsActiveStep', currentStep);
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Update the store with current step for progress tracking
      updateFormData('sellerQuestionsActiveStep', currentStep + 1);
    } else if (currentStep === totalSteps) {
      // Form is complete
      updateFormData('sellerQuestionsComplete', true);
      setLocalCompletionState(true);
    }
  }, [currentStep, totalSteps, updateFormData]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Update the store with current step for progress tracking
      updateFormData('sellerQuestionsActiveStep', currentStep - 1);
    }
  }, [currentStep, updateFormData]);

  const handleBack = useCallback(() => {
    // Reset the current section completion and visibility
    updateFormData('sellerQuestionsComplete', false);
    updateFormData('showSellerQuestions', false);

    if (formData.needsLoan === 'yes') {
      // Go back to LoanDetails Q7 (loan path)
      updateFormData('loanDetailsComplete', false);
      updateFormData('showLoanDetails', true);
      updateFormData('loanDetailsCurrentStep', 7);
      // Reset the showSellerQuestions flag to ensure proper flow
      updateFormData('showSellerQuestions', false);
             } else {
      // Go back to BuyerDetails (no loan path - "Do you need a loan?" question)
      updateFormData('buyerDetailsComplete', false);
      updateFormData('showLoanDetails', false);
      // For ACT, the loan question is step 7, for others it's step 6
      const loanQuestionStep = formData.selectedState === 'ACT' ? 7 : 6;
      updateFormData('buyerDetailsCurrentStep', loanQuestionStep);
    }
  }, [formData.needsLoan, updateFormData]);



  // Check if current step is valid
  const isCurrentStepValid = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.sellerQuestion1 && formData.sellerQuestion1.trim() !== '';
      case 2:
        return formData.sellerQuestion2 && formData.sellerQuestion2.trim() !== '';
      case 3:
        return formData.sellerQuestion3 && formData.sellerQuestion3.trim() !== '';
      case 4:
        return formData.sellerQuestion4 && formData.sellerQuestion4.trim() !== '';
      case 5:
        return formData.sellerQuestion5 && formData.sellerQuestion5.trim() !== '';
      case 6:
        return formData.sellerQuestion6 && formData.sellerQuestion6.trim() !== '';
      case 7:
        return formData.sellerQuestion7 && formData.sellerQuestion7.trim() !== '';
      default:
        return false;
    }
  }, [currentStep, formData.sellerQuestion1, formData.sellerQuestion2, formData.sellerQuestion3, formData.sellerQuestion4, formData.sellerQuestion5, formData.sellerQuestion6, formData.sellerQuestion7]);

  // Use shared navigation hook
  useFormNavigation({
    currentStep,
    totalSteps,
    isCurrentStepValid,
    onNext: nextStep,
    onPrev: prevStep,
    onComplete: useCallback(() => {
      if (localCompletionState) {
        // We're on the completion page, move to final completion
        updateFormData('allFormsComplete', true);
      } else {
        // Handle form completion
        updateFormData('sellerQuestionsComplete', true);
        setLocalCompletionState(true);
      }
    }, [localCompletionState, updateFormData]),
    onBack: useCallback(() => {
      console.log('onBack called, localCompletionState:', localCompletionState);
      if (localCompletionState) {
        // We're on the completion page, go back to the last question
        console.log('Going back from completion page to Q7');
        updateFormData('sellerQuestionsComplete', false);
        setLocalCompletionState(false);
        setCurrentStep(7);
      } else {
        // We're on a question, use the normal back logic
        console.log('Using normal back logic');
        handleBack();
      }
    }, [localCompletionState, updateFormData, handleBack]),
    isComplete: localCompletionState
  });

  const renderStep = () => {
    console.log('renderStep called, localCompletionState:', localCompletionState, 'currentStep:', currentStep);
    // Show completion message if form is complete
    if (localCompletionState) {
      console.log('Rendering completion message');
      return (
        <div className="flex flex-col mt-12 pr-2">
          <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
            Seller Questions Complete
          </h2>
          <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
            All forms are now complete!
          </p>
        </div>
      );
    }

    console.log('Rendering question for step:', currentStep);
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Seller Question 1
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
                  onClick={() => updateFormData('sellerQuestion1', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.sellerQuestion1 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.sellerQuestion1 === option.value
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
              Seller Question 2
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
                  onClick={() => updateFormData('sellerQuestion2', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.sellerQuestion2 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.sellerQuestion2 === option.value
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
              Seller Question 3
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
                  onClick={() => updateFormData('sellerQuestion3', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.sellerQuestion3 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.sellerQuestion3 === option.value
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
              Seller Question 4
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
                  onClick={() => updateFormData('sellerQuestion4', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.sellerQuestion4 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.sellerQuestion4 === option.value
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
              Seller Question 5
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
                  onClick={() => updateFormData('sellerQuestion5', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.sellerQuestion5 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.sellerQuestion5 === option.value
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
              Seller Question 6
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
                  onClick={() => updateFormData('sellerQuestion6', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.sellerQuestion6 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.sellerQuestion6 === option.value
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
              Seller Question 7
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
                  onClick={() => updateFormData('sellerQuestion7', option.value)}
                  className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                    formData.sellerQuestion7 === option.value
                      ? 'border-gray-800 bg-secondary text-white shadow-lg'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                  <div className={`text-xs leading-none ${
                    formData.sellerQuestion7 === option.value
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
        <span className={`text-xs font-extrabold mr-2 pt-14 whitespace-nowrap ${
          formData.sellerQuestionsComplete ? 'text-base-100' : 'text-primary'
        }`}>
                     <span className="text-xs text-base-100">{formData.needsLoan === 'yes' ? '3' : '2'}</span>
           {formData.sellerQuestionsComplete ? (getStartingStepNumber() + totalSteps - 1) : (currentStep + getStartingStepNumber() - 1)} 
           <span className={`text-xs ${formData.sellerQuestionsComplete ? 'text-primary' : ''}`}>→</span>
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
        {/* Progress Bar - Now rendered on main page for medium+ screens */}
        <div className="block md:hidden w-full bg-gray-100 h-1 mb-4">
          <div 
            className="bg-primary h-1 transition-all duration-300"
            style={{ width: `${localCompletionState ? 100 : ((currentStep - 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        
                 <div className="flex justify-between max-w-4xl mx-auto mt-4">
           {localCompletionState ? (
             // Completion state: Back to last question and Next to final completion
             <>
               <button
                 onClick={() => {
                   console.log('Back button clicked from completion page');
                   setLocalCompletionState(false);
                   setCurrentStep(7);
                   updateFormData('sellerQuestionsComplete', false);
                 }}
                 className="bg-primary px-6 py-3 rounded-full border border-primary text-base font-medium hover:bg-primary hover:border-gray-700 hover:shadow-sm flex-shrink-0 cursor-pointer"
               >
                 &lt;
               </button>
               
               <button
                 onClick={() => {
                   console.log('Next button clicked from completion page');
                   updateFormData('allFormsComplete', true);
                 }}
                 className="flex-1 ml-4 px-6 py-3 bg-primary rounded-full border border-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm text-base font-medium cursor-pointer"
               >
                 Complete
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
