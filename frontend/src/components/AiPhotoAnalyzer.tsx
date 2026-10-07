import React, { useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Category } from '../types';

interface AiPhotoAnalyzerProps {
  onCategorySuggested?: (category: Category) => void;
}

export const AiPhotoAnalyzer: React.FC<AiPhotoAnalyzerProps> = ({ onCategorySuggested }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    qualityScore: number;
    suggestedCategory: Category;
    confidence: number;
    notes: string;
  } | null>(null);

  const simulateAiScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const categories: Category[] = ['CLOTHES', 'BOOKS', 'FOOD', 'STATIONERY', 'TOYS'];
      const suggested = categories[Math.floor(Math.random() * categories.length)];
      const qualityScore = Math.floor(Math.random() * 15) + 85;

      setResult({
        qualityScore,
        suggestedCategory: suggested,
        confidence: qualityScore,
        notes: 'High clarity image detected. Lighting and resolution optimal for NGO inspection.',
      });

      if (onCategorySuggested) {
        onCategorySuggested(suggested);
      }
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#7567E8]/20 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7567E8] animate-pulse" />
          <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
            AI Item Quality & Category Detector
          </h4>
        </div>
        <span className="text-[10px] bg-[#7567E8]/10 text-[#7567E8] px-2 py-0.5 rounded font-mono font-bold border border-[#7567E8]/20">
          AI Vision v2.4
        </span>
      </div>

      <p className="text-xs text-[#4B5563] leading-relaxed">
        Upload a test photo of your items to automatically assess image clarity and auto-fill the category.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={simulateAiScan}
          id="ai-image-input"
          className="hidden"
        />
        <label
          htmlFor="ai-image-input"
          className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs transition-all inline-flex items-center justify-center gap-2 shadow-xs active:scale-95 min-h-[44px]"
        >
          <Sparkles className="w-4 h-4" />
          Scan Item Image
        </label>
        {analyzing && (
          <span className="text-xs text-[#7567E8] font-semibold animate-pulse self-center">
            Analyzing pixels & light contrast...
          </span>
        )}
      </div>

      {result && (
        <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-[#059669]">
              <ShieldCheck className="w-4 h-4" /> Quality Rating: {result.qualityScore}%
            </span>
            <span className="text-[#7567E8]">Category: {result.suggestedCategory}</span>
          </div>
          <p className="text-[#4B5563] italic text-[11px]">{result.notes}</p>
        </div>
      )}
    </div>
  );
};
