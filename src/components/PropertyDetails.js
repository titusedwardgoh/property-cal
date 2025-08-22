import { useState, useEffect } from 'react';
import { formatCurrency } from '../states/shared/baseCalculations.js';
import { useStateSelector } from '../states/useStateSelector.js';
import useFormNavigation from './shared/FormNavigation.js';
import { useFormStore } from '../stores/formStore';

export default function PropertyDetails() {
  const formData = useFormStore();
  const updateFormData = useFormStore(state => state.updateFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('forward'); // 'forward' or 'backward'
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 6; // Always 6 internal steps, but step 3 is skipped for non-WA
  
  // Calculate the display step number (what the user sees)
  const getDisplayStep = () => {
    if (formData.selectedState === 'WA') {
      return currentStep;
    } else {
      // For non-WA states, adjust step numbers to show sequentially
      if (currentStep >= 4) {
        return currentStep - 1; // Show 3, 4, 5 instead of 4, 5, 6
      }
      return currentStep;
    }
  };

  // Get the actual total steps for display (what user sees)
  const getDisplayTotalSteps = () => {
    return formData.selectedState === 'WA' ? 6 : 5;
  };
   
  // Get state-specific functions when state is selected
  const { stateFunctions } = useStateSelector(formData.selectedState || 'NSW');

  // Watch for propertyDetailsCurrentStep flag from BuyerDetails
  useEffect(() => {
    if (formData.propertyDetailsCurrentStep) {
      setCurrentStep(formData.propertyDetailsCurrentStep);
      setIsComplete(false);
      // Reset the flag
      updateFormData('propertyDetailsCurrentStep', null);
    }
  }, [formData.propertyDetailsCurrentStep, updateFormData]);

  // Watch for state changes and reset WA field if needed
  useEffect(() => {
    if (formData.selectedState !== 'WA' && formData.isWA) {
      updateFormData('isWA', '');
    }
  }, [formData.selectedState, formData.isWA, updateFormData]);

  // Watch for state changes and reset ACT field if needed
  useEffect(() => {
    if (formData.selectedState !== 'ACT' && formData.isACT) {
      updateFormData('isACT', false);
    }
  }, [formData.selectedState, formData.isACT, updateFormData]);

  const nextStep = () => {
    console.log('✅ PropertyDetails - OK/Next Pressed:', {
      currentStep,
      propertyAddress: formData.propertyAddress,
      selectedState: formData.selectedState,
      propertyCategory: formData.propertyCategory,
      propertyType: formData.propertyType,
      propertyPrice: formData.propertyPrice
    });
    
    // Check if we're at the last step for the current state
    const isLastStep = currentStep === 6; // Both WA and non-WA end at internal step 6
    
    if (!isLastStep) {
      setDirection('forward');
      setIsTransitioning(true);
      setTimeout(() => {
        let nextStepNumber = currentStep + 1;
        
        // Skip WA question step if state is not WA
        if (currentStep === 2 && formData.selectedState !== 'WA') {
          nextStepNumber = 4; // Skip to property category step
        }
        
        setCurrentStep(nextStepNumber);
        setIsTransitioning(false);
      }, 150);
    } else {
      // Form is complete - calculate and log stamp duty
      calculateAndLogStampDuty();
      setIsComplete(true);
      // Set a separate flag for UpfrontCosts (not the main navigation flag)
      updateFormData('propertyDetailsFormComplete', true);
    }
  };

  const goToBuyerDetails = () => {
    // Move to buyer details when user presses next
    updateFormData('propertyDetailsComplete', true);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection('backward');
      setIsTransitioning(true);
      setTimeout(() => {
        let prevStepNumber = currentStep - 1;
        
        // Handle back navigation for non-WA states
        if (formData.selectedState !== 'WA') {
          if (currentStep === 6) {
            // From property price, go back to property type (step 5)
            prevStepNumber = 5;
          } else if (currentStep === 5) {
            // From property type, go back to property category (step 4)
            prevStepNumber = 4;
          } else if (currentStep === 4) {
            // From property category, go back to state selection (step 2)
            prevStepNumber = 2;
          }
        } else {
          // For WA states, normal back navigation
          if (currentStep === 4 && formData.selectedState === 'WA') {
            prevStepNumber = 3; // Go back to WA question
          }
        }
        
        setCurrentStep(prevStepNumber);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Calculate stamp duty when form is complete (no logging)
  const calculateAndLogStampDuty = () => {
    if (!stateFunctions) {
      return;
    }
    
    // Calculate stamp duty but don't log it
    stateFunctions.calculateStampDuty(formData.propertyPrice, formData.selectedState);
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyAddress && formData.propertyAddress.trim() !== '';
      case 2:
        return formData.selectedState && formData.selectedState.trim() !== '';
      case 3:
        return formData.selectedState === 'WA' ? (formData.isWA && formData.isWA.trim() !== '') : true;
      case 4:
        return formData.propertyCategory && formData.propertyCategory.trim() !== '';
      case 5:
        return formData.propertyType && formData.propertyType.trim() !== '';
      case 6:
        return formData.propertyPrice && formData.propertyPrice.trim() !== '';
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
    onComplete: goToBuyerDetails,
    onBack: null, // No back action for PropertyDetails
    isComplete
  });

  const renderStep = () => {
    // Show completion message if form is complete
    if (isComplete) {
      return (
        <div className="flex flex-col mt-12 pr-2">
          <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
            Basic Property Details Complete
          </h2>
          <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
            Now a few questions about you... 
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              What&apos;s the property address?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
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
        );

      case 2:
        return (
          <div className="flex flex-col mt-12 pr-2">
            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
              Which state is the property in?
            </h2>
            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Different states have different stamp duty rates and concessions
            </p>
            <div className="max-w-md relative pr-8">
              <div className="grid grid-cols-4 gap-3 max-w-md">
                {['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'].map((state) => (
                  <button
                    key={state}
                    onClick={() => {
                      updateFormData('selectedState', state);
                      // Set isACT flag when ACT is selected
                      if (state === 'ACT') {
                        updateFormData('isACT', true);
                      } else {
                        updateFormData('isACT', false);
                      }
                    }}
                    className={`px-3 py-2 text-base font-medium rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                      formData.selectedState === state
                        ? 'border-gray-800 bg-secondary text-white shadow-lg'
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

      case 3:
        if (formData.selectedState === 'WA') {
          return (
            <div className="flex flex-col mt-12 pr-2">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
                Is the Property north or south?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
                This affects stamp duty calculations for Western Australia
              </p>
              <div className="grid grid-cols-1 gap-2 max-w-4xl mb-8">
                {[
                  { value: 'north', label: 'North' },
                  { value: 'south', label: 'South' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('isWA', option.value)}
                    className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                      formData.isWA === option.value
                        ? 'border-gray-800 bg-secondary text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                    <div className={`text-xs leading-none ${
                      formData.isWA === option.value
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>of the 26th parallel of South latitude.</div>
                  </button>
                ))}
              </div>
            </div>
          );
        }
        // If not WA, this step should not be reached, but handle gracefully
        return null;

        case 4:
          return (
            <div className="flex flex-col mt-12 pr-2">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
                What type of property is it?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
                This affects your stamp duty concessions and ongoing costs
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-3xl">
                {[
                  { value: 'house', label: 'House' },
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'townhouse', label: 'Townhouse' },
                  { value: 'land', label: 'Vacant Land' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('propertyCategory', option.value)}
                    className={`py-3 px-3 rounded-lg border-2 transition-all duration-200 flex justify-center w-32 hover:scale-105 ${
                      formData.propertyCategory === option.value
                        ? 'border-gray-800 bg-secondary text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-base font-medium text-center">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 5:
          return (
            <div className="flex flex-col mt-12 pr-2">
              <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
                Is this a new or existing property?
              </h2>
              <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg">
                New properties may have different concessions and costs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-4xl mb-8">
                {[
                  { value: 'existing', label: 'Existing Property', description: 'Already built and lived in' },
                  { value: 'new', label: 'New Property', description: 'Recently built, never lived in' },
                  { value: 'off-the-plan', label: 'Off-the-Plan', description: 'Buying before construction' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('propertyType', option.value)}
                    className={`py-2 px-3 rounded-lg border-2 flex flex-col items-start transition-all duration-200 hover:scale-105 ${
                      formData.propertyType === option.value
                        ? 'border-gray-800 bg-secondary text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-base font-medium mb-2 leading-none">{option.label}</div>
                    <div className={`text-xs leading-none ${
                      formData.propertyType === option.value
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
                What is the property&apos;s price?
              </h2>
              <p className=" md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto ">
                This will help us calculate your stamp duty and other costs
              </p>
              <div className="max-w-md mx-auto relative pr-8">
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none ${
                  formData.propertyPrice ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  $
                </div>
                <input
                  type="tel"
                  placeholder="0"
                  value={formData.propertyPrice ? formatCurrency(parseInt(formData.propertyPrice)).replace('$', '') : ''}
                  onChange={(e) => {
                    // Remove all non-digit characters and update form data
                    const numericValue = e.target.value.replace(/[^\d]/g, '');
                    updateFormData('propertyPrice', numericValue);
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
         <span className={`text-xs font-extrabold mr-2 pt-14 whitespace-nowrap ${isComplete ? 'text-base-100' : "text-primary"}`}><span className="text-xs text-base-100">1</span>{isComplete ? getDisplayTotalSteps() : getDisplayStep()}<span className={`text-xs ${isComplete ? 'text-primary' : ""}`}>→</span></span>
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
            className="bg-primary h-1 transition-all duration-300"
            style={{ width: `${isComplete ? 100 : ((getDisplayStep() - 1) / getDisplayTotalSteps()) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between max-w-4xl mx-auto mt-4">
          {isComplete ? (
            // Completion state: Back and Next buttons
            <>
              <button
                onClick={() => {
                  setIsComplete(false);
                  updateFormData('propertyDetailsFormComplete', false);
                }}
                className="bg-primary px-6 py-3 rounded-full border border-primary text-base font-medium border-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm flex-shrink-0 cursor-pointer"
              >
                &lt;
              </button>
              
              <button
                onClick={goToBuyerDetails}
                className="flex-1 ml-4 px-6 py-3 rounded-full border border-primary bg-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm text-base font-medium cursor-pointer"
              >
                Next
              </button>
            </>
          ) : currentStep === 1 ? (
            // Step 1: Full width OK button
            <button
              onClick={nextStep}
              disabled={!isCurrentStepValid()}
              className={`w-full px-6 py-3 rounded-full border text-base font-medium ${
                !isCurrentStepValid()
                  ? 'border-primary text-base-100 cursor-not-allowed bg-primary'
                  : 'border-primary bg-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm cursor-pointer'
              }`}
            >
              OK
            </button>
          ) : (
            // Step 2 onwards: Back and Next buttons with smooth transition
            <>
              <button
                onClick={prevStep}
                className={`bg-primary px-6 py-3 rounded-full border border-primary text-base font-medium border-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm flex-shrink-0 cursor-pointer ${
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
                className={`flex-1 ml-4 px-6 py-3 bg-primary rounded-full border text-base font-medium ${
                  !isCurrentStepValid()
                    ? 'border-primary text-base-100 cursor-not-allowed bg-gray-50'
                    : 'border-primary bg-primary text-base hover:bg-primary hover:border-gray-700 hover:shadow-sm cursor-pointer'
                }`}
              >
                                 {getDisplayStep() === getDisplayTotalSteps() ? 'Calculate Stamp Duty' : 'OK'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
