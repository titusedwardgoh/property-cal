import { Receipt } from 'lucide-react';

export default function OtherFees({
  includeLandTransferFee,
  setIncludeLandTransferFee,
  includeLegalFees,
  setIncludeLegalFees,
  includeInspectionFees,
  setIncludeInspectionFees,
  price,
  deposit,
  stampDuty,
  foreignBuyerDuty,
  landTransferFee,
  legalFees,
  inspectionFees
}) {
  // Only show fees when property price has been entered
  if (!price || price <= 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Receipt className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Other Fees</h2>
        </div>
        <div className="text-sm text-gray-600">
          Enter property price to see available fees
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <Receipt className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">Other Fees</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="landTransferFee"
            checked={includeLandTransferFee}
            onChange={(e) => setIncludeLandTransferFee(e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <label htmlFor="landTransferFee" className="text-sm font-medium text-gray-900">
              Land Transfer Fee
            </label>
            <p className="text-xs text-gray-600">
              Official registration of property ownership
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="legalFees"
            checked={includeLegalFees}
            onChange={(e) => setIncludeLegalFees(e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <label htmlFor="legalFees" className="text-sm font-medium text-gray-900">
              Legal & Conveyancing
            </label>
            <p className="text-xs text-gray-600">
              Legal services for property transfer
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="inspectionFees"
            checked={includeInspectionFees}
            onChange={(e) => setIncludeInspectionFees(e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <label htmlFor="inspectionFees" className="text-sm font-medium text-gray-900">
              Building & Pest Inspection
            </label>
            <p className="text-xs text-gray-600">
              Pre-purchase property condition assessment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 