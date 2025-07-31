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
  
  // Optional fees checkboxes
  const [includeLandTransferFee, setIncludeLandTransferFee] = useState(true);
  const [includeLegalFees, setIncludeLegalFees] = useState(true);
  const [includeInspectionFees, setIncludeInspectionFees] = useState(true);

  const handleAddressSearch = () => {
    if (propertyData.address) {
      const estimatedPrice = estimatePropertyPrice(propertyData.address, propertyData.state);
      setPropertyData(prev => ({ ...prev, estimatedPrice }));
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