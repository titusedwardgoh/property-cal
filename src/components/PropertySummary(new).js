export default function PropertySummary({ formData }) {
  // Check if ALL property questions are answered
  const hasAllPropertyData = 
    formData.propertyPrice && 
    formData.propertyAddress && 
    formData.selectedState && 
    formData.propertyCategory && 
    formData.propertyType;
  
  if (!hasAllPropertyData) {
    return null; // Don't show anything until all questions are answered
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="text-2xl mr-2">🏠</span>
        Property Summary
      </h4>
      
      <div className="space-y-4">
        {/* Address - Full width if present */}
        {formData.propertyAddress && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center mb-2">
              <span className="text-blue-600 text-lg mr-2">📍</span>
              <span className="text-gray-600 font-medium">Address</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{formData.propertyAddress}</div>
          </div>
        )}
        
        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center mb-2">
              <span className="text-green-600 text-lg mr-2">💵</span>
              <span className="text-gray-600 font-medium">Price</span>
            </div>
            <div className="text-2xl font-bold text-green-700">${Number(formData.propertyPrice).toLocaleString()}</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center mb-2">
              <span className="text-purple-600 text-lg mr-2">🗺️</span>
              <span className="text-gray-600 font-medium">State</span>
            </div>
            <div className="text-xl font-semibold text-gray-900">{formData.selectedState}</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center mb-2">
              <span className="text-orange-600 text-lg mr-2">🏠</span>
              <span className="text-gray-600 font-medium">Type</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 capitalize">{formData.propertyCategory}</div>
          </div>
          
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
            <div className="flex items-center mb-2">
              <span className="text-teal-600 text-lg mr-2">🆕</span>
              <span className="text-gray-600 font-medium">Status</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 capitalize">{formData.propertyType}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
