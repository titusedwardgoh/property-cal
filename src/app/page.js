"use client";

import { useState } from 'react';
import UpfrontCosts from '../components/UpfrontCosts';
import PropertyDetailsNew from '../components/PropertyDetails(new)';

export default function page() {
    const [formData, setFormData] = useState({
        propertyPrice: '',
        propertyAddress: '',
        selectedState: '',
        propertyType: '',
        propertyCategory: ''
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
                    <UpfrontCosts />
                    <PropertyDetailsNew 
                        formData={formData}
                        updateFormData={updateFormData}
                    />
                </div>
            </main>
        </div>
    )
}