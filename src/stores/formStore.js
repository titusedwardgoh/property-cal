import { create } from 'zustand'

export const useFormStore = create((set, get) => ({
  // Property Details
  propertyPrice: '',
  propertyAddress: '',
  selectedState: '',
  propertyType: '',
  propertyCategory: '',
  propertyDetailsComplete: false,
  propertyDetailsFormComplete: false,
  
  // Buyer Details
  buyerType: '',
  isPPR: '',
  isAustralianResident: '',
  isFirstHomeBuyer: '',
  needsLoan: '',
  savingsAmount: '',
  buyerDetailsComplete: false,
  buyerDetailsCurrentStep: null,
  
  // Navigation flags
  showLoanDetails: false,
  showSellerQuestions: false,
  
  // Loan Details
  loanQuestion1: '',
  loanQuestion2: '',
  loanQuestion3: '',
  loanQuestion4: '',
  loanQuestion5: '',
  loanQuestion6: '',
  loanQuestion7: '',
  loanDetailsComplete: false,
  loanDetailsCurrentStep: null,
  
  // Seller Questions
  sellerQuestion1: '',
  sellerQuestion2: '',
  sellerQuestion3: '',
  sellerQuestion4: '',
  sellerQuestion5: '',
  sellerQuestion6: '',
  sellerQuestion7: '',
  sellerQuestionsComplete: false,
  
  // Final completion
  allFormsComplete: false,
  
  // Actions to update state
  updateFormData: (field, value) => set((state) => ({ 
    ...state, 
    [field]: value 
  })),
  
  // Reset all form data
  resetForm: () => set({
    propertyPrice: '',
    propertyAddress: '',
    selectedState: '',
    propertyType: '',
    propertyCategory: '',
    buyerType: '',
    isPPR: '',
    isAustralianResident: '',
    isFirstHomeBuyer: '',
    needsLoan: '',
    savingsAmount: '',
    propertyDetailsComplete: false,
    propertyDetailsFormComplete: false,
    buyerDetailsComplete: false,
    buyerDetailsCurrentStep: null,
    showLoanDetails: false,
    showSellerQuestions: false,
    loanQuestion1: '',
    loanQuestion2: '',
    loanQuestion3: '',
    loanQuestion4: '',
    loanQuestion5: '',
    loanQuestion6: '',
    loanQuestion7: '',
    loanDetailsComplete: false,
    loanDetailsCurrentStep: null,
    sellerQuestion1: '',
    sellerQuestion2: '',
    sellerQuestion3: '',
    sellerQuestion4: '',
    sellerQuestion5: '',
    sellerQuestion6: '',
    sellerQuestion7: '',
    sellerQuestionsComplete: false,
    allFormsComplete: false,
  }),
  
  // Helper to get all current form data
  getFormData: () => get(),
  
  // Helper to check if a specific section is complete
  isSectionComplete: (section) => {
    const state = get()
    switch (section) {
      case 'property':
        return state.propertyDetailsComplete
      case 'buyer':
        return state.buyerDetailsComplete
      case 'loan':
        return state.loanDetailsComplete
      case 'seller':
        return state.sellerQuestionsComplete
      default:
        return false
    }
  }
}))
