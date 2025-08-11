// Questions to ask the seller and property investigation functions

// Property condition and history questions
export const getPropertyConditionQuestions = () => [
  "When was the property last renovated?",
  "Are there any known structural issues?",
  "Has there been any water damage or flooding?",
  "What is the age of the roof, plumbing, and electrical systems?",
  "Are there any pest infestations or treatments?",
  "What is the condition of the foundation?",
  "Are there any building code violations or outstanding permits?",
  "Has the property been used for any commercial purposes?",
  "Are there any easements or restrictions on the property?",
  "What is the history of insurance claims?"
];

// Financial and legal questions
export const getFinancialLegalQuestions = () => [
  "What is the current council rate amount?",
  "Are there any outstanding rates or taxes?",
  "What is the water rate and usage pattern?",
  "Are there any body corporate fees (if applicable)?",
  "What is the current rental yield (if investment property)?",
  "Are there any existing tenants or leases?",
  "What is the property's current market value assessment?",
  "Are there any liens or encumbrances on the property?",
  "What is the property's zoning classification?",
  "Are there any planned developments in the area?"
];

// Neighborhood and location questions
export const getNeighborhoodQuestions = () => [
  "What is the crime rate in the area?",
  "Are there good schools nearby?",
  "What is the public transport accessibility?",
  "Are there any planned infrastructure projects?",
  "What is the noise level and traffic pattern?",
  "Are there any environmental concerns (flooding, bushfire risk)?",
  "What is the demographic makeup of the neighborhood?",
  "Are there any community facilities nearby?",
  "What is the parking situation?",
  "Are there any restrictions on renovations or extensions?"
];

// Utility and maintenance questions
export const getUtilityMaintenanceQuestions = () => [
  "What are the average monthly utility costs?",
  "Are there any shared utility connections?",
  "What is the internet and mobile coverage like?",
  "Are there any ongoing maintenance issues?",
  "What is the condition of the garden/landscaping?",
  "Are there any shared walls or boundaries?",
  "What is the parking arrangement?",
  "Are there any storage facilities?",
  "What is the security situation?",
  "Are there any noise restrictions or bylaws?"
];

// Property-specific questions based on type
export const getPropertyTypeQuestions = (propertyType, propertyCategory) => {
  const baseQuestions = [
    "What is the exact square footage of the property?",
    "What is the orientation and natural light like?",
    "Are there any views or outlooks?",
    "What is the privacy situation?",
    "Are there any shared facilities?"
  ];

  if (propertyCategory === 'apartment') {
    return [
      ...baseQuestions,
      "What floor is the apartment on?",
      "Is there elevator access?",
      "What are the body corporate rules?",
      "Are there any restrictions on pets or renovations?",
      "What is the parking allocation?",
      "Are there any shared amenities (pool, gym, etc.)?"
    ];
  }

  if (propertyCategory === 'house') {
    return [
      ...baseQuestions,
      "What is the block size and shape?",
      "Are there any heritage restrictions?",
      "What is the soil type and drainage?",
      "Are there any trees that need maintenance?",
      "What is the street frontage?",
      "Are there any easements or right-of-ways?"
    ];
  }

  if (propertyCategory === 'land') {
    return [
      ...baseQuestions,
      "What is the soil type and bearing capacity?",
      "Are there any slope or drainage issues?",
      "What is the access to utilities?",
      "Are there any building height restrictions?",
      "What is the minimum build size requirement?",
      "Are there any environmental overlays?"
    ];
  }

  return baseQuestions;
};

// Generate comprehensive question list
export const generateQuestionnaire = (propertyType, propertyCategory, isInvestment = false) => {
  const questions = {
    propertyCondition: getPropertyConditionQuestions(),
    financialLegal: getFinancialLegalQuestions(),
    neighborhood: getNeighborhoodQuestions(),
    utilityMaintenance: getUtilityMaintenanceQuestions(),
    propertySpecific: getPropertyTypeQuestions(propertyType, propertyCategory)
  };

  if (isInvestment) {
    questions.financialLegal.push(
      "What is the current rental income?",
      "What are the typical vacancy rates in the area?",
      "Are there any tenant-related issues?",
      "What is the potential for capital growth?"
    );
  }

  return questions;
};

// Calculate property investigation priority score
export const calculateInvestigationPriority = (propertyPrice, propertyType, propertyCategory, isInvestment) => {
  let score = 0;
  
  // Higher price = higher priority
  if (propertyPrice > 1000000) score += 30;
  else if (propertyPrice > 500000) score += 20;
  else score += 10;
  
  // Property type priority
  if (propertyCategory === 'land') score += 25; // Land needs more investigation
  else if (propertyCategory === 'apartment') score += 20;
  else score += 15;
  
  // Investment properties need more due diligence
  if (isInvestment) score += 25;
  
  return Math.min(score, 100); // Cap at 100
};
