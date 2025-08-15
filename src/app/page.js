"use client";

import { useState } from 'react';
import UpfrontCosts from '../components/UpfrontCosts';
import PropertyDetails from '../components/PropertyDetails';
import BuyerDetails from '../components/BuyerDetails';

export default function Page() {
    const [formData, setFormData] = useState({
        propertyPrice: '',
        propertyAddress: '',
        selectedState: '',
        propertyType: '',
        propertyCategory: '',
        buyerType: '',
        propertyDetailsComplete: false,
        propertyDetailsFormComplete: false
    });

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-base-200">
            <main className="container mx-auto px-4 py-4 max-w-4xl">
                <div className="space-y-6">
                    <UpfrontCosts formData={formData} />
                    {!formData.propertyDetailsComplete ? (
                        <PropertyDetails 
                            formData={formData}
                            updateFormData={updateFormData}
                        />
                    ) : (
                        <BuyerDetails 
                            formData={formData}
                            updateFormData={updateFormData}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}