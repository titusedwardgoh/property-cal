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

  // Calculate stamp duty when property details are complete
  const calculateStampDuty = () => {
    if (!stateFunctions || !formData.propertyPrice || !formData.selectedState || !formData.propertyType) {
      return 0;
    }
    
    const stampDuty = stateFunctions.calculateStampDuty(formData.propertyPrice, formData.selectedState);
    return stampDuty;
  };

  // Calculate all upfront costs using the new comprehensive function
  const calculateAllUpfrontCosts = () => {
    if (!formData.buyerDetailsComplete || !stateFunctions?.calculateUpfrontCosts) {
      // Return basic stamp duty calculation when buyer details not complete
      // But check for temp off-the-plan concession if property details are complete
      if (formData.propertyDetailsFormComplete && formData.selectedState === 'VIC' && stateFunctions?.calculateVICTempOffThePlanConcession) {
        const buyerData = {
          buyerType: formData.buyerType || '',
          isPPR: formData.isPPR || '',
          isAustralianResident: formData.isAustralianResident || '',
          isFirstHomeBuyer: formData.isFirstHomeBuyer || '',
          hasPensionCard: formData.hasPensionCard || '',
          needsLoan: formData.needsLoan || '',
          dutiableValue: formData.dutiableValue || '',
          sellerQuestionsComplete: formData.sellerQuestionsComplete || false
        };

        const propertyData = {
          propertyPrice: formData.propertyPrice,
          propertyType: formData.propertyType,
          propertyCategory: formData.propertyCategory
        };

        const stampDutyAmount = calculateStampDuty();
        const tempConcession = stateFunctions.calculateVICTempOffThePlanConcession(
          buyerData, 
          propertyData, 
          formData.selectedState, 
          stampDutyAmount, 
          formData.dutiableValue || 0, 
          formData.sellerQuestionsComplete || false
        );

        // If temp concession is eligible, show it
        if (tempConcession.eligible) {
          return {
            stampDuty: { amount: stampDutyAmount, label: "Stamp Duty" },
            concessions: [{
              type: 'Temp Off-The-Plan',
              amount: tempConcession.concessionAmount,
              eligible: true,
              reason: tempConcession.reason,
              showBothConcessions: false,
              tempOffThePlanConcession: tempConcession
            }],
            grants: [],
            foreignDuty: { amount: 0, applicable: false },
            netStateDuty: stampDutyAmount - tempConcession.concessionAmount,
            totalUpfrontCosts: stampDutyAmount - tempConcession.concessionAmount,
            allConcessions: {
              tempOffThePlan: tempConcession
            }
          };
        }
      }

      return {
        stampDuty: { amount: calculateStampDuty(), label: "Stamp Duty" },
        concessions: [],
        grants: [],
        foreignDuty: { amount: 0, applicable: false },
        netStateDuty: calculateStampDuty(),
        totalUpfrontCosts: calculateStampDuty()
      };
    }

    const buyerData = {
      buyerType: formData.buyerType,
      isPPR: formData.isPPR,
      isAustralianResident: formData.isAustralianResident,
      isFirstHomeBuyer: formData.isFirstHomeBuyer,
      hasPensionCard: formData.hasPensionCard,
      needsLoan: formData.needsLoan,
      dutiableValue: formData.dutiableValue,
      sellerQuestionsComplete: formData.sellerQuestionsComplete
    };

    const propertyData = {
      propertyPrice: formData.propertyPrice,
      propertyType: formData.propertyType,
      propertyCategory: formData.propertyCategory
    };

    return stateFunctions.calculateUpfrontCosts(buyerData, propertyData, formData.selectedState);
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
              {isPropertyComplete ? formatCurrency(calculateAllUpfrontCosts().totalUpfrontCosts) : '$0'}
            </div>
          </div>
        </div>
      </div>
      
            {/* Dropdown overlay - appears above the component without pushing content down */}
      {isExpanded && isPropertyComplete && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10">
          <div className="space-y-3">
            {(() => {
              const upfrontCosts = calculateAllUpfrontCosts();
              
              return (
                <>
                  {/* Show Property Price first if BuyerDetails complete and no loan needed */}
                  {formData.buyerDetailsComplete && formData.needsLoan === 'no' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Property Price</span>
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium">
                        {formatCurrency(parseInt(formData.propertyPrice) || 0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Stamp Duty */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Stamp Duty</span>
                    <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium">
                      {formatCurrency(upfrontCosts.stampDuty.amount)}
                    </span>
                  </div>
                  
                  {/* Concessions */}
                  {(() => {
                    // Add temp concession to concessions array if eligible but not already applied
                    let concessionsToShow = [...upfrontCosts.concessions];
                    
                    if (upfrontCosts.tempConcessionEligible && 
                        upfrontCosts.allConcessions?.tempOffThePlan && 
                        !concessionsToShow.some(c => c.type === 'Temp Off-The-Plan')) {
                      concessionsToShow.push({
                        type: 'Temp Off-The-Plan',
                        amount: upfrontCosts.allConcessions.tempOffThePlan.concessionAmount,
                        eligible: true,
                        reason: upfrontCosts.allConcessions.tempOffThePlan.reason,
                        showBothConcessions: false,
                        tempOffThePlanConcession: upfrontCosts.allConcessions.tempOffThePlan
                      });
                    }
                    
                    return concessionsToShow;
                  })().map((concession, index) => (
                    <div key={index}>
                      {/* Main concession */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">
                          {concession.type === 'Pensioner' ? 'Pensioner Duty Concession' : 
                           concession.type === 'First Home Buyer' ? 'First Home Buyer Concession' :
                           concession.type === 'Temp Off-The-Plan' ? 'Temp Off-The-Plan Concession' :
                           `Stamp Duty Concession${concession.type ? ` (${concession.type})` : ''}`}
                        </span>
                        <span className={`text-md md:text-sm lg:text-base xl:text-xl font-medium ${concession.amount > 0 ? 'text-green-600' : 'text-gray-600'} ${concession.amount === 0 ? 'relative group cursor-help' : ''}`} title={
                          concession.amount === 0 ? 
                            (concession.type === 'Pensioner' && concession.pensionerConcession && concession.pensionerConcession.reason && concession.pensionerConcession.reason.includes('additional seller information') ? 
                              'You are eligible but additional information is required to calculate your concession' : 
                              concession.type === 'Temp Off-The-Plan' && concession.tempOffThePlanConcession && concession.tempOffThePlanConcession.details && concession.tempOffThePlanConcession.details.waitingForSellerQuestions ?
                              'You are eligible but concession amount will be calculated after seller questions' :
                              'You are eligible but the concession amount is 0 at this property price') : 
                            ''
                        }>
                          {concession.amount > 0 ? `-${formatCurrency(concession.amount)}` : formatCurrency(concession.amount)}
                          {concession.amount === 0 && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                              {concession.type === 'Pensioner' && concession.pensionerConcession && concession.pensionerConcession.reason && concession.pensionerConcession.reason.includes('additional seller information') ? 
                                'You are eligible but additional information is required to calculate your concession' : 
                                concession.type === 'Temp Off-The-Plan' && concession.tempOffThePlanConcession && concession.tempOffThePlanConcession.details && concession.tempOffThePlanConcession.details.waitingForSellerQuestions ?
                                'You are eligible but concession amount will be calculated after seller questions' :
                                'You are eligible but the concession amount is 0 at this property price'}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </span>
                      </div>
                      
                      {/* Second concession if user is eligible for both */}
                      {concession.showBothConcessions && (
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">
                            {concession.type === 'Pensioner' ? 'First Home Buyer Duty Concession' : 'Pensioner Duty Concession'}
                          </span>
                          <span className="text-md md:text-sm lg:text-base xl:text-xl font-medium text-gray-600 relative group cursor-help" title={
                            concession.amount > 0 ? 'Only one concession can be applied' : 
                            concession.pensionerConcession && concession.pensionerConcession.reason && concession.pensionerConcession.reason.includes('additional seller information') ? 'You are eligible but additional information is required to calculate your concession' :
                            'You are eligible but the concession amount is 0 at this property price'
                          }>
                            $0
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                              {concession.amount > 0 ? 'Only one concession can be applied' : 
                               concession.pensionerConcession && concession.pensionerConcession.reason && concession.pensionerConcession.reason.includes('additional seller information') ? 'You are eligible but additional information is required to calculate your concession' :
                               'You are eligible but the concession amount is 0 at this property price'}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Foreign Purchaser Duty */}
                  {upfrontCosts.foreignDuty.applicable && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Foreign Purchaser Duty</span>
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium text-red-600">
                        {formatCurrency(upfrontCosts.foreignDuty.amount)}
                      </span>
                    </div>
                  )}
                  
                  {/* Net State Duty */}
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                    <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-semibold">Net State Duty</span>
                    <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-semibold">
                      {formatCurrency(upfrontCosts.netStateDuty)}
                    </span>
                  </div>
                  
                  {/* Grants */}
                  {upfrontCosts.grants.map((grant, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">First Home Owners Grant</span>
                      <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl font-medium text-green-600">
                        -{formatCurrency(grant.amount)}
                      </span>
                    </div>
                  ))}
                  
                  {/* Show Ineligible Grants/Concessions below Net State Duty */}
                  {formData.buyerDetailsComplete && (formData.selectedState === 'NSW' || formData.selectedState === 'VIC') && (() => {
                    // Check if we have ineligible items to show
                    const hasIneligibleItems = 
                      (upfrontCosts.concessions.length === 0) ||
                      (upfrontCosts.grants.length === 0) ||
                      (formData.selectedState === 'VIC' && upfrontCosts.allConcessions);
                    
                    if (!hasIneligibleItems) return null;
                    
                    return (
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="text-sm text-gray-500 mb-2">State Grants and Concessions:</div>
                        
                        <div className="space-y-3">
                          {/* Show ineligible concessions for VIC */}
                          {formData.selectedState === 'VIC' && upfrontCosts.allConcessions && (
                            <>
                              {/* Show ineligible concessions from calculation results (e.g., when both FHO and Pensioner are eligible but only higher one is applied) */}
                              {upfrontCosts.ineligibleConcessions && upfrontCosts.ineligibleConcessions.map((concession, index) => (
                                <div key={`ineligible-${index}`} className="flex justify-between items-center">
                                  <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">
                                    {concession.type === 'Pensioner' ? 'Pensioner Duty Concession' : 
                                     concession.type === 'First Home Buyer' ? 'First Home Buyer Concession' :
                                     `Stamp Duty Concession${concession.type ? ` (${concession.type})` : ''}`}
                                  </span>
                                  <span className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help" title={concession.reason}>
                                    Not Eligible
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                                      {concession.reason}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                  </span>
                                </div>
                              ))}
                              
                              {/* Only show First Home Buyer Concession if it's NOT eligible */}
                              {!upfrontCosts.allConcessions.firstHome.eligible && 
                               !upfrontCosts.ineligibleConcessions?.some(c => c.type === 'First Home Buyer') && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">First Home Buyer Concession</span>
                                  <span className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help" title={upfrontCosts.allConcessions.firstHome.reason}>
                                    Not Eligible
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                                      {upfrontCosts.allConcessions.firstHome.reason}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                  </span>
                                </div>
                              )}
                              {/* Only show PPR Concession if it's NOT eligible */}
                              {!upfrontCosts.allConcessions.ppr.eligible && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">PPR Concession</span>
                                  <span className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help" title={upfrontCosts.allConcessions.ppr.reason}>
                                    Not Eligible
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                                      {upfrontCosts.allConcessions.ppr.reason}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                  </span>
                                </div>
                              )}
                              {/* Only show Pensioner Concession if it's NOT eligible */}
                              {!upfrontCosts.allConcessions.pensioner.eligible && 
                               !upfrontCosts.ineligibleConcessions?.some(c => c.type === 'Pensioner') && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Pensioner Duty Concession</span>
                                  <span className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help" title={upfrontCosts.allConcessions.pensioner.reason}>
                                    Not Eligible
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                                      {upfrontCosts.allConcessions.pensioner.reason}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                  </span>
                                </div>
                              )}
                              {/* Only show Temp Off-The-Plan Concession if it's NOT eligible */}
                              {!upfrontCosts.allConcessions.tempOffThePlan.eligible && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Temp Off-The-Plan Concession</span>
                                  <span className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help" title={upfrontCosts.allConcessions.tempOffThePlan.reason}>
                                    Not Eligible
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                                      {upfrontCosts.allConcessions.tempOffThePlan.reason}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                          
                          {/* Show ineligible Stamp Duty Concession for NSW */}
                          {formData.selectedState === 'NSW' && upfrontCosts.concessions.length === 0 && (() => {
                            // Get the reason for ineligibility
                            const buyerData = {
                              buyerType: formData.buyerType,
                              isPPR: formData.isPPR,
                              isAustralianResident: formData.isAustralianResident,
                              isFirstHomeBuyer: formData.isFirstHomeBuyer,
                              hasPensionCard: formData.hasPensionCard
                            };
                            const propertyData = {
                              propertyPrice: formData.propertyPrice,
                              propertyType: formData.propertyType,
                              propertyCategory: formData.propertyCategory
                            };
                            const stampDutyAmount = calculateStampDuty();
                            const concessionResult = stateFunctions?.calculateNSWFirstHomeBuyersAssistance ? 
                              stateFunctions.calculateNSWFirstHomeBuyersAssistance(buyerData, propertyData, formData.selectedState, stampDutyAmount) : 
                              { reason: 'Concession not available' };
                            
                            return (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">Stamp Duty Concession</span>
                                <span className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help" title={concessionResult.reason}>
                                  Not Eligible
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                                    {concessionResult.reason}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                  </div>
                                </span>
                              </div>
                            );
                          })()}
                          
                          {/* Show ineligible First Home Owners Grant */}
                          {upfrontCosts.grants.length === 0 && (() => {
                            // Get the reason for ineligibility
                            const buyerData = {
                              buyerType: formData.buyerType,
                              isPPR: formData.isPPR,
                              isAustralianResident: formData.isAustralianResident,
                              isFirstHomeBuyer: formData.isFirstHomeBuyer,
                              hasPensionCard: formData.hasPensionCard
                            };
                            const propertyData = {
                              propertyPrice: formData.propertyPrice,
                              propertyType: formData.propertyType,
                              propertyCategory: formData.propertyCategory
                            };
                            const grantResult = formData.selectedState === 'NSW' && stateFunctions?.calculateNSWFirstHomeOwnersGrant ? 
                              stateFunctions.calculateNSWFirstHomeOwnersGrant(buyerData, propertyData, formData.selectedState) :
                              formData.selectedState === 'VIC' && stateFunctions?.calculateVICFirstHomeOwnersGrant ?
                              stateFunctions.calculateVICFirstHomeOwnersGrant(buyerData, propertyData, formData.selectedState) :
                              { reason: 'Grant not available' };
                            
                            return (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-800 text-md md:text-sm lg:text-base xl:text-xl">First Home Owners Grant</span>
                                <span className="text-gray-600 text-md md:text-sm lg:text-base xl:text-xl text-red-600 relative group cursor-help" title={grantResult.reason}>
                                  Not Eligible
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs z-20">
                                    {grantResult.reason}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                  </div>
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })()}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
