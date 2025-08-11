"use client";

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyDetailsCard from '../components/PropertyDetailsCard(new)';
import UpfrontCostsDisplay from '../components/UpfrontCostsDisplay(new)';
import PropertySummary from '../components/PropertySummary(new)';

export default function Home() {
  const [formData, setFormData] = useState({
    // Property details
    propertyPrice: '',
    propertyAddress: '', // Added property address
    selectedState: '',
    propertyType: '',
    propertyCategory: '',
    
    // Buyer details (will be added later)
    isFirstHomeBuyer: false,
    isPPR: false,
    isForeignBuyer: false,
    
    // Loan details (will be added later)
    loanAmount: '',
    loanTerm: '',
    interestRate: '',
    
    // Results (will be calculated as they go)
    stampDuty: 0,
    firstHomeOwnersGrant: 0,
    landTransferFee: 0,
    foreignBuyerDuty: 0,
    legalFees: 0,
    inspectionFees: 0,
    councilRates: 0,
    waterRates: 0,
    bodyCorporate: 0,
    insurance: 0,
    movingCosts: 0,
    utilityConnections: 0
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Main Card Container */}
        <div className="space-y-6">
          
          {/* Property Details Card */}
          <PropertyDetailsCard 
            formData={formData}
            updateFormData={updateFormData}
          />
          
          {/* Upfront Costs Display */}
          <UpfrontCostsDisplay 
            formData={formData}
          />
          
          {/* Property Summary - Below upfront costs */}
          <PropertySummary 
            formData={formData}
          />
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}