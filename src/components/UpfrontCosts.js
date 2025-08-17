import { useState, useEffect } from 'react';
import { useStateSelector } from '../states/useStateSelector.js';
import { formatCurrency } from '../states/shared/baseCalculations.js';

import { useFormStore } from '../stores/formStore';

export default function UpfrontCosts() {
    const formData = useFormStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if PropertyDetails form is actually complete (after pressing Complete button)
  const isPropertyComplete = formData.propertyDetailsFormComplete;

  // Get state-specific functions when state is selected
  const { stateFunctions } = useStateSelector(formData.selectedState || 'NSW');

  // Close expanded state when formData changes (navigation occurs)
  useEffect(() => {
    setIsExpanded(false);
  }, [formData]);

  const toggleExpanded = () => {
    if (isPropertyComplete) {
      setIsExpanded(!isExpanded);
    }
  };

  // Calculate stamp duty when expanded
  const calculateStampDuty = () => {
    if (!stateFunctions || !formData.propertyPrice || !formData.selectedState || !formData.propertyType) {
      return 0;
    }
    
    const stampDuty = stateFunctions.calculateStampDuty(formData.propertyPrice, formData.selectedState);
    return stampDuty;
  };

  // Calculate total upfront costs
  const calculateTotalCosts = () => {
    const stampDuty = calculateStampDuty();
    const concession = -2; // Stamp duty concession
    // Only include Property Price if BuyerDetails is complete and no loan is needed
    const propertyPrice = (formData.buyerDetailsComplete && formData.needsLoan === 'no') ? parseInt(formData.propertyPrice) || 0 : 0;
    return stampDuty + concession + propertyPrice;
  };

  return (
    <div className="relative">
      <div 
        onClick={toggleExpanded}
        className={`bg-secondary rounded-lg shadow-lg px-6 py-4 md:p-8 ${isPropertyComplete ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-xl md:text-2xl font-medium text-base-100">Upfront Costs</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-4xl font-semibold text-base-100">
              {isPropertyComplete ? formatCurrency(calculateTotalCosts()) : '$0'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Dropdown overlay - appears above the component without pushing content down */}
      {isExpanded && isPropertyComplete && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10">
          <div className="space-y-3">
            {/* Show Property Price first if BuyerDetails complete and no loan needed */}
            {formData.buyerDetailsComplete && formData.needsLoan === 'no' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-800 text-lg">Property Price</span>
                <span className="text-gray-800 text-lg font-semibold">
                  {formatCurrency(parseInt(formData.propertyPrice) || 0)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-800 text-lg">Stamp Duty</span>
              <span className="text-gray-800 text-lg font-semibold">
                {formatCurrency(calculateStampDuty())}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 text-lg">Stamp Duty Concession</span>
              <span className="text-gray-800 text-lg font-semibold text-green-600">
                -$2
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
