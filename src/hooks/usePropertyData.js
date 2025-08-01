import { useState } from 'react';
import { estimatePropertyPrice } from '../utils/calculations.js';

export function usePropertyData() {
  const [propertyData, setPropertyData] = useState({
    address: '',
    price: 0,
    state: 'NSW',
    estimatedPrice: 0
  });

  const [useEstimatedPrice, setUseEstimatedPrice] = useState(false);
  const [isForeignBuyer, setIsForeignBuyer] = useState(false);
  const [isFirstHomeBuyer, setIsFirstHomeBuyer] = useState(false);
  const [needsLoan, setNeedsLoan] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [includeOtherFees, setIncludeOtherFees] = useState(false);
  const [isInvestor, setIsInvestor] = useState(false);
  
  // Optional fees checkboxes
  const [includeLandTransferFee, setIncludeLandTransferFee] = useState(false);
  const [includeLegalFees, setIncludeLegalFees] = useState(false);
  const [includeInspectionFees, setIncludeInspectionFees] = useState(false);
  
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
    handleAddressSearch,
    getEffectivePrice
  };
} 