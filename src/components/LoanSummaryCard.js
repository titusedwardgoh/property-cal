import React from 'react';
import { formatCurrency } from '../utils/calculations.js';

export default function LoanSummaryCard({ lvr, totalRepayments, totalInterest }) {
  const hasLoan = totalRepayments > 0;
  
  if (!hasLoan) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">LVR (Loan to Value Ratio):</span>
          <span className="font-semibold text-blue-900">{lvr ? lvr.toFixed(2) + '%' : '0%'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Total Loan Repayments:</span>
          <span className="font-semibold text-blue-900">{formatCurrency(totalRepayments)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Total Interest Charged:</span>
          <span className="font-semibold text-blue-900">{formatCurrency(totalInterest)}</span>
        </div>
      </div>
    </div>
  );
}