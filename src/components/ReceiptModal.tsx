import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface ReceiptModalProps {
  receiptUrl: string;
  onClose: () => void;
}

export function ReceiptModal({ receiptUrl, onClose }: ReceiptModalProps) {
  const handleDownload = () => {
    window.open(receiptUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl mx-4 transform transition-all duration-300" onClick={e => e.stopPropagation()}>
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Receipt Preview</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Download Receipt"
            >
              <Download className="w-5 h-5" />
            </button>
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Open in New Tab"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded-b-xl">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-inner">
            <img
              src={receiptUrl}
              alt="Receipt"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400?text=Receipt+Not+Found';
              }}
            />
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            <p>Tip: Click the download button to save the receipt or open in a new tab for full resolution</p>
          </div>
        </div>
      </div>
    </div>
  );
}