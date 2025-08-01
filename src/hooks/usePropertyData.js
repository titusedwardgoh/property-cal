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
    setIncludeOtherFees,
    isInvestor,
    setIsInvestor,
    includeLandTransferFee,
    setIncludeLandTransferFee,
    includeLegalFees,
    setIncludeLegalFees,
    includeInspectionFees,
    setIncludeInspectionFees,
    handleAddressSearch,
    getEffectivePrice
  };
} 