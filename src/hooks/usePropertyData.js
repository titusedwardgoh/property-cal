import { useState, useEffect } from 'react';
import { estimatePropertyPrice } from '../utils/calculations.js';

export function usePropertyData() {
  const [propertyData, setPropertyData] = useState({
    address: '',
    price: 0,
    state: '',
    estimatedPrice: 0,
    propertyType: 'existing', // Default to existing property
    propertyCategory: '',
    completionYear: null,
    developerName: '',
    constructionStarted: false,
    developmentCompletion: null,
    dutiableValue: null
  });

  const [useEstimatedPrice, setUseEstimatedPrice] = useState(false);
  const [isForeignBuyer, setIsForeignBuyer] = useState(null);
  const [isFirstHomeBuyer, setIsFirstHomeBuyer] = useState(null);
  const [needsLoan, setNeedsLoan] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [includeOtherFees, setIncludeOtherFees] = useState(false);
  const [isInvestor, setIsInvestor] = useState(null);
  
  // Optional fees checkboxes
  const [includeLandTransferFee, setIncludeLandTransferFee] = useState(false);
  const [includeLegalFees, setIncludeLegalFees] = useState(false);
  const [includeInspectionFees, setIncludeInspectionFees] = useState(false);
  
  // Custom fee amounts
  const [customLandTransferFee, setCustomLandTransferFee] = useState(0);
  const [customLegalFees, setCustomLegalFees] = useState(0);
  const [customInspectionFees, setCustomInspectionFees] = useState(0);
  
  // Council and Water Rates - Always included since they're always payable
  const [includeCouncilRates, setIncludeCouncilRates] = useState(true);
  const [includeWaterRates, setIncludeWaterRates] = useState(true);
  const [customCouncilRates, setCustomCouncilRates] = useState(0);
  const [customWaterRates, setCustomWaterRates] = useState(0);
  
  // Body Corporate/Strata - Default checked for apartments
  const [includeBodyCorporate, setIncludeBodyCorporate] = useState(false);
  const [customBodyCorporate, setCustomBodyCorporate] = useState(0);
  const [hasUserSetBodyCorporate, setHasUserSetBodyCorporate] = useState(false);
  
  // Auto-check body corporate for apartments
  useEffect(() => {
    if (propertyData.propertyCategory === 'apartment') {
      setIncludeBodyCorporate(true);
      // Only set default if user hasn't manually set a value and current value is 0
      if (!hasUserSetBodyCorporate && customBodyCorporate === 0) {
        setCustomBodyCorporate(4000); // Default $4,000 for apartments
      }
    }
  }, [propertyData.propertyCategory]);
  
  // Store the saved states of individual fee checkboxes
  const [savedLandTransferFee, setSavedLandTransferFee] = useState(false);
  const [savedLegalFees, setSavedLegalFees] = useState(false);
  const [savedInspectionFees, setSavedInspectionFees] = useState(false);

  const handleAddressSearch = async () => {
    if (propertyData.address) {
      setIsSearching(true);
      setSearchError(null);
      try {
        const estimatedPrice = estimatePropertyPrice(propertyData.address, propertyData.state);
        setPropertyData(prev => ({ ...prev, estimatedPrice }));
      } catch (error) {
        setSearchError('Failed to estimate property price. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }
  };

  const getEffectivePrice = () => {
    return useEstimatedPrice ? propertyData.estimatedPrice || 0 : propertyData.price;
  };

  // Handle individual fee checkbox changes and save their states
  const handleLandTransferFeeChange = (checked) => {
    setIncludeLandTransferFee(checked);
    if (checked) {
      setSavedLandTransferFee(true);
    }
  };

  const handleLegalFeesChange = (checked) => {
    setIncludeLegalFees(checked);
    if (checked) {
      setSavedLegalFees(true);
    }
  };

  const handleInspectionFeesChange = (checked) => {
    setIncludeInspectionFees(checked);
    if (checked) {
      setSavedInspectionFees(true);
    }
  };

  // Handle "Other fees" checkbox toggle
  const handleOtherFeesToggle = (checked) => {
    setIncludeOtherFees(checked);
    
    if (checked) {
      // Restore saved states when "Other fees" is checked
      setIncludeLandTransferFee(savedLandTransferFee);
      setIncludeLegalFees(savedLegalFees);
      setIncludeInspectionFees(savedInspectionFees);
    } else {
      // Reset to false when "Other fees" is unchecked
      setIncludeLandTransferFee(false);
      setIncludeLegalFees(false);
      setIncludeInspectionFees(false);
    }
  };

  // Custom setter for body corporate that tracks user input
  const setCustomBodyCorporateWithFlag = (value) => {
    setCustomBodyCorporate(value);
    setHasUserSetBodyCorporate(true);
  };

  return {
    propertyData,
    setPropertyData,
    useEstimatedPrice,
    setUseEstimatedPrice,
    isForeignBuyer,
    setIsForeignBuyer,
    isFirstHomeBuyer,
    setIsFirstHomeBuyer,
    needsLoan,
    setNeedsLoan,
    isSearching,
    searchError,
    includeOtherFees,
    setIncludeOtherFees: handleOtherFeesToggle,
    isInvestor,
    setIsInvestor,
    includeLandTransferFee,
    setIncludeLandTransferFee: handleLandTransferFeeChange,
    includeLegalFees,
    setIncludeLegalFees: handleLegalFeesChange,
    includeInspectionFees,
    setIncludeInspectionFees: handleInspectionFeesChange,
    customLandTransferFee,
    setCustomLandTransferFee,
    customLegalFees,
    setCustomLegalFees,
    customInspectionFees,
    setCustomInspectionFees,
    includeCouncilRates,
    setIncludeCouncilRates,
    includeWaterRates,
    setIncludeWaterRates,
    customCouncilRates,
    setCustomCouncilRates,
    customWaterRates,
    setCustomWaterRates,
    includeBodyCorporate,
    setIncludeBodyCorporate,
    customBodyCorporate,
    setCustomBodyCorporate: setCustomBodyCorporateWithFlag,
    handleAddressSearch,
    getEffectivePrice
  };
} 