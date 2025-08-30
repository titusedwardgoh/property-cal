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

  // Calculate First Home Owners Grant eligibility and amount (NSW or VIC)
  const calculateFirstHomeOwnersGrant = () => {
    if (!formData.buyerDetailsComplete) {
      return { eligible: false, amount: 0, reason: 'Buyer details not complete' };
    }

    const buyerData = {
      buyerType: formData.buyerType,
      isPPR: formData.isPPR,
      isAustralianResident: formData.isAustralianResident,
      isFirstHomeBuyer: formData.isFirstHomeBuyer
    };

    const propertyData = {
      propertyPrice: formData.propertyPrice,
      propertyType: formData.propertyType,
      propertyCategory: formData.propertyCategory
    };

    let fhogResult;
    
    // Call appropriate grant function based on state
    if (formData.selectedState === 'NSW' && stateFunctions?.calculateNSWFirstHomeOwnersGrant) {
      fhogResult = stateFunctions.calculateNSWFirstHomeOwnersGrant(buyerData, propertyData, formData.selectedState);
    } else if (formData.selectedState === 'VIC' && stateFunctions?.calculateVICFirstHomeOwnersGrant) {
      fhogResult = stateFunctions.calculateVICFirstHomeOwnersGrant(buyerData, propertyData, formData.selectedState);
    } else {
      // Default case for other states
      fhogResult = { eligible: false, amount: 0, reason: 'Grant not available for this state' };
    }
    
    // Calculate First Home Buyers Assistance Scheme stamp duty concession
    if (formData.selectedState === 'NSW' && stateFunctions?.calculateNSWFirstHomeBuyersAssistance) {
      const stampDuty = calculateStampDuty();
      const concessionResult = stateFunctions.calculateNSWFirstHomeBuyersAssistance(buyerData, propertyData, formData.selectedState, stampDuty);
    }

    // Calculate Foreign Purchaser Duty
    if (formData.selectedState === 'NSW' && stateFunctions?.calculateNSWForeignPurchaserDuty) {
      const foreignDutyResult = stateFunctions.calculateNSWForeignPurchaserDuty(buyerData, propertyData, formData.selectedState);
    }
    
    return fhogResult;
  };

  // Calculate NSW First Home Buyers Assistance Scheme stamp duty concession
  const calculateStampDutyConcession = () => {
    if (!stateFunctions?.calculateNSWFirstHomeBuyersAssistance || !formData.buyerDetailsComplete || formData.selectedState !== 'NSW') {
      return { eligible: false, concessionAmount: 0, reason: '' };
    }

    const buyerData = {
      buyerType: formData.buyerType,
      isPPR: formData.isPPR,
      isAustralianResident: formData.isAustralianResident,
      isFirstHomeBuyer: formData.isFirstHomeBuyer
    };

    const propertyData = {
      propertyPrice: formData.propertyPrice,
      propertyType: formData.propertyType,
      propertyCategory: formData.propertyCategory
    };

    const stampDuty = calculateStampDuty();
    return stateFunctions.calculateNSWFirstHomeBuyersAssistance(buyerData, propertyData, formData.selectedState, stampDuty);
  };

  // Calculate NSW Foreign Purchaser Duty
  const calculateForeignPurchaserDuty = () => {
    if (!stateFunctions?.calculateNSWForeignPurchaserDuty || !formData.buyerDetailsComplete || formData.selectedState !== 'NSW') {
      return { applicable: false, amount: 0, reason: '' };
    }

    const buyerData = {
      buyerType: formData.buyerType,
      isPPR: formData.isPPR,
      isAustralianResident: formData.isAustralianResident,
      isFirstHomeBuyer: formData.isFirstHomeBuyer
    };

    const propertyData = {
      propertyPrice: formData.propertyPrice,
      propertyType: formData.propertyType,
      propertyCategory: formData.propertyCategory
    };

    return stateFunctions.calculateNSWForeignPurchaserDuty(buyerData, propertyData, formData.selectedState);
  };

  // Calculate total upfront costs
  const calculateTotalCosts = () => {
    const stampDuty = calculateStampDuty();
    const concessionResult = calculateStampDutyConcession();
    const concession = concessionResult.eligible ? -concessionResult.concessionAmount : 0;
    const foreignDutyResult = calculateForeignPurchaserDuty();
    const foreignDuty = foreignDutyResult.applicable ? foreignDutyResult.amount : 0;
    const firstHomeOwnersGrant = calculateFirstHomeOwnersGrant();
    const grantAmount = firstHomeOwnersGrant.eligible ? -firstHomeOwnersGrant.amount : 0;
    
    // Only include Property Price if BuyerDetails is complete and no loan is needed
    const propertyPrice = (formData.buyerDetailsComplete && formData.needsLoan === 'no') ? parseInt(formData.propertyPrice) || 0 : 0;
    return stampDuty + concession + propertyPrice + grantAmount + foreignDuty;
  };

  return (
    <div className="relative">
      <div 
        onClick={toggleExpanded}
        className={`bg-secondary rounded-lg shadow-lg px-6 py-4 ${isPropertyComplete ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg lg:text-xl xl:text-2xl font-medium text-base-100">Upfront Costs</h3>
          </div>
          <div className="text-right">
            <div className="text-lg lg:text-xl xl:text-2xl font-semibold text-base-100">
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
                <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Property Price</span>
                <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium">
                  {formatCurrency(parseInt(formData.propertyPrice) || 0)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Stamp Duty</span>
              <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium">
                {formatCurrency(calculateStampDuty())}
              </span>
            </div>
                         {/* Only show Stamp Duty Concession when NSW is selected and buyer details are complete */}
             {formData.selectedState === 'NSW' && formData.buyerDetailsComplete && stateFunctions?.calculateNSWFirstHomeBuyersAssistance && (() => {
               const concession = calculateStampDutyConcession();
               if (concession.eligible && concession.concessionAmount > 0) {
                 return (
                   <>
                     <div className="flex justify-between items-center">
                       <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Stamp Duty Concession</span>
                       <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium text-green-600">
                         -{formatCurrency(concession.concessionAmount)}
                       </span>
                     </div>
                     {/* Show Foreign Purchaser Duty if applicable */}
                     {(() => {
                       const foreignDuty = calculateForeignPurchaserDuty();
                       if (foreignDuty.applicable) {
                         return (
                           <div className="flex justify-between items-center">
                             <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Foreign Purchaser Duty</span>
                             <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium text-red-600">
                               {formatCurrency(foreignDuty.amount)}
                             </span>
                           </div>
                         );
                       }
                       return null;
                     })()}
                     <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                       <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-semibold">Net State Duty</span>
                       <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-semibold">
                         {formatCurrency(calculateStampDuty() + calculateForeignPurchaserDuty().amount - concession.concessionAmount)}
                       </span>
                     </div>
                   </>
                 );
                               } else if (concession.concessionAmount === 0 && concession.reason) {
                  // Don't show ineligible concession here - will show below Net State Duty
                  return null;
                } else {
                  return (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Stamp Duty Concession</span>
                      <span className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl">
                        $0
                      </span>
                    </div>
                  );
                }
                          })()}
             
                           {/* Show Foreign Purchaser Duty if applicable */}
              {formData.selectedState === 'NSW' && formData.buyerDetailsComplete && stateFunctions?.calculateNSWForeignPurchaserDuty && (
                (() => {
                  const foreignDuty = calculateForeignPurchaserDuty();
                  if (foreignDuty.applicable) {
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Foreign Purchaser Duty</span>
                          <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium text-red-600">
                            {formatCurrency(foreignDuty.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                          <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-semibold">Net State Duty</span>
                          <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-semibold">
                            {formatCurrency(calculateStampDuty() + foreignDuty.amount)}
                          </span>
                        </div>
                      </>
                    );
                  }
                  return null;
                })()
              )}
  
                             {/* Show Ineligible Grants/Concessions below Net State Duty */}
               {(formData.selectedState === 'NSW' || formData.selectedState === 'VIC') && formData.buyerDetailsComplete && (() => {
                 const concession = calculateStampDutyConcession();
                 const grant = calculateFirstHomeOwnersGrant();
                 
                                   // Only show items that are actually ineligible (concession amount is 0 and have a reason)
                  const hasIneligibleItems = (concession.concessionAmount === 0 && concession.reason) || 
                                           (!grant.eligible && grant.reason);
                  
                  if (!hasIneligibleItems) return null;
                  
                  return (
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="text-sm text-gray-500 mb-2">State Grants and Concessions:</div>
                      {/* Show ineligible Stamp Duty Concession */}
                      {concession.concessionAmount === 0 && concession.reason && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Stamp Duty Concession</span>
                          <span 
                            className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help"
                            title={concession.reason}
                          >
                            Not Eligible
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                              {concession.reason}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </span>
                        </div>
                      )}
                      {/* Show ineligible First Home Owners Grant */}
                      {!grant.eligible && grant.reason && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">First Home Owners Grant</span>
                          <span 
                            className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help"
                            title={grant.reason}
                          >
                            Not Eligible
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                              {grant.reason}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </span>
                        </div>
                      )}
                    </div>
                  );
               })()}

              {/* Show First Home Owners Grant if eligible */}
            {formData.buyerDetailsComplete && (formData.selectedState === 'NSW' || formData.selectedState === 'VIC') && (
              (() => {
                const grant = calculateFirstHomeOwnersGrant();
                if (grant.eligible) {
                  return (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">First Home Owners Grant</span>
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium text-green-600">
                        -{formatCurrency(grant.amount)}
                      </span>
                    </div>
                  );
                } else if (!grant.eligible && grant.reason) {
                  // Don't show ineligible grant here - will show in ineligible items section
                  return null;
                }
                return null;
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
