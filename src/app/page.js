"use client";

import UpfrontCosts from '../components/UpfrontCosts';
import PropertyDetails from '../components/PropertyDetails';
import BuyerDetails from '../components/BuyerDetails';
import LoanDetails from '../components/LoanDetails';
import SellerQuestions from '../components/SellerQuestions';
import { useFormStore } from '../stores/formStore';

export default function Page() {
    const formData = useFormStore();
    const propertyDetailsComplete = formData.propertyDetailsComplete;
    const buyerDetailsComplete = formData.buyerDetailsComplete;
    const needsLoan = formData.needsLoan;
    const showLoanDetails = formData.showLoanDetails;
    const loanDetailsComplete = formData.loanDetailsComplete;
    const showSellerQuestions = formData.showSellerQuestions;
    const sellerQuestionsComplete = formData.sellerQuestionsComplete;
    const allFormsComplete = formData.allFormsComplete;

    return (
        <div className="min-h-screen bg-base-200">
            <main className="container mx-auto px-4 py-4 max-w-4xl">
                <div className="space-y-6">
                    <UpfrontCosts />
                    {!propertyDetailsComplete ? (
                        <PropertyDetails />
                    ) : !buyerDetailsComplete ? (
                        <BuyerDetails />
                    ) : buyerDetailsComplete && showLoanDetails && !loanDetailsComplete ? (
                        <LoanDetails />
                    ) : buyerDetailsComplete && loanDetailsComplete && !showSellerQuestions ? (
                        <LoanDetails />
                    ) : buyerDetailsComplete && showSellerQuestions && !sellerQuestionsComplete ? (
                        <SellerQuestions />
                    ) : buyerDetailsComplete && sellerQuestionsComplete && !allFormsComplete ? (
                        <SellerQuestions />
                    ) : buyerDetailsComplete && !showLoanDetails && !showSellerQuestions && !formData.buyerDetailsCurrentStep ? (
                        <BuyerDetails /> // This ensures BuyerDetails completion page remains visible
                    ) : formData.buyerDetailsCurrentStep ? (
                        <BuyerDetails /> // Show BuyerDetails when going back to a specific step
                    ) : allFormsComplete ? (
                        <div className="bg-base-100 rounded-lg overflow-hidden mt-15 p-8 text-center">
                            <h2 className="text-3xl md:text-5xl font-base text-gray-800 mb-4 leading-tight">
                                All Forms Complete!
                            </h2>
                            <p className="md:text-2xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                                Thank you for completing all the forms. Your information has been processed.
                            </p>
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    )
}