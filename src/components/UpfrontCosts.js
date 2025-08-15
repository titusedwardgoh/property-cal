import { useState } from 'react';

export default function UpfrontCosts({ formData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if PropertyDetails form is actually complete (when all 5 questions are done)
  const isPropertyComplete = formData.propertyType && formData.propertyType.trim() !== '';

  const toggleExpanded = () => {
    if (isPropertyComplete) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="relative">
      <div 
        onClick={toggleExpanded}
        className={`bg-secondary rounded-lg shadow-lg px-6 py-4 md:p-8 ${isPropertyComplete ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-xl md:text-2xl font-medium text-base-100">Upfront Costs</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-4xl font-semibold text-base-100">$0</div>
          </div>
        </div>
      </div>
      
      {/* Dropdown overlay - appears above the component without pushing content down */}
      {isExpanded && isPropertyComplete && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10">
          <div className="flex justify-between items-center">
            <span className="text-gray-800 text-lg">Stamp Duty</span>
            <span className="text-gray-800 text-lg font-semibold">$x</span>
          </div>
        </div>
      )}
    </div>
  );
}
