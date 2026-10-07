import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { Category } from '../types';
import { MobileBottomSheet } from './common/MobileBottomSheet';

interface VoiceAssistantModalProps {
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [parsedCategory, setParsedCategory] = useState<Category | null>(null);
  const [parsedAnalysis, setParsedAnalysis] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [manualInput, setManualInput] = useState<string>('');

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const analyzeSpokenText = (text: string) => {
    if (!text.trim()) return;

    const lower = text.toLowerCase();
    let cat: Category = 'OTHER';

    if (/\b(coat|jacket|sweater|shirt|pant|cloth|clothes|clothing|dress|wear|shoes)\b/.test(lower)) {
      cat = 'CLOTHES';
    } else if (/\b(food|meal|rice|grain|bread|canned|fruit|vegetable|grocery|groceries|eating)\b/.test(lower)) {
      cat = 'FOOD';
    } else if (/\b(book|books|novel|story|textbook|encyclopedia|reading|literature)\b/.test(lower)) {
      cat = 'BOOKS';
    } else if (/\b(pen|pencil|notebook|paper|copy|stationery|eraser|sharpener|ruler)\b/.test(lower)) {
      cat = 'STATIONERY';
    } else if (/\b(toy|toys|doll|puzzle|game|ball|boardgame|lego|teddy)\b/.test(lower)) {
      cat = 'TOYS';
    }

    setParsedCategory(cat);
    setParsedAnalysis(
      `AI Voice Assistant parsed your spoken request! Detected category: ${cat}. Ready to pre-fill donation request.`
    );
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setListening(true);
        setTranscript('');
        setParsedCategory(null);
        setParsedAnalysis(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setManualInput(currentTranscript);
        analyzeSpokenText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setListening(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setTranscript(manualInput.trim());
    analyzeSpokenText(manualInput.trim());
  };

  const handleApplyDonation = () => {
    if (!parsedCategory) return;
    onClose();
    navigate(`/donate/new?category=${parsedCategory}&description=${encodeURIComponent(transcript || manualInput)}`);
  };

  return (
    <MobileBottomSheet
      isOpen={true}
      onClose={onClose}
      title="Live AI Voice Assistant"
      subtitle="Speak or type to pre-fill donation categories"
      icon={
        <div className="w-9 h-9 rounded-xl bg-[#7567E8]/10 border border-[#7567E8]/20 text-[#7567E8] flex items-center justify-center">
          <Mic className="w-5 h-5" />
        </div>
      }
      maxWidthClass="max-w-md"
      footer={
        <div className="flex items-center justify-end w-full">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-11 min-h-[44px] px-5 rounded-xl font-bold text-xs bg-[#F9FAFB] hover:bg-[#F4F2FA] text-[#111827] border border-[#E5E7EB] transition-colors touch-manipulation flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-center">
        {/* Animated Mic Button */}
        <div className="py-2">
          <button
            type="button"
            onClick={startListening}
            disabled={listening}
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all shadow-lg touch-manipulation ${
              listening
                ? 'bg-[#DC2626] text-white animate-pulse shadow-[#DC2626]/40 ring-4 ring-[#FEE2E2]'
                : 'bg-[#7567E8] hover:bg-[#5E51CD] text-white shadow-[#7567E8]/30 hover:scale-105 active:scale-95'
            }`}
          >
            {listening ? (
              <MicOff className="w-9 h-9 animate-spin" />
            ) : (
              <Mic className="w-9 h-9" />
            )}
          </button>
          <p className="text-xs font-bold text-[#111827] mt-3">
            {listening ? '🎙️ Listening... Speak now!' : 'Tap mic to speak your donation'}
          </p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">
            E.g. "I want to donate winter jackets and warm clothing"
          </p>
        </div>

        {!speechSupported && (
          <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-xs rounded-xl text-left">
            Microphone speech recognition is not supported in this browser window. You can type below!
          </div>
        )}

        {/* Text Input Fallback / Edit Spoken Sentence */}
        <form onSubmit={handleManualSubmit} className="flex gap-2 text-left">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Or type what you want to donate..."
            className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] focus:ring-2 focus:ring-[#7567E8]/20 transition-all"
          />
          <button
            type="submit"
            className="h-12 min-h-[44px] px-4 rounded-xl bg-[#7567E8] hover:bg-[#5E51CD] text-white text-xs font-bold transition-colors touch-manipulation shrink-0 flex items-center justify-center"
          >
            Parse
          </button>
        </form>

        {/* Real Live Spoken Output */}
        {(transcript || parsedAnalysis) && (
          <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E7EB] text-left text-xs">
            {transcript && (
              <div>
                <div className="text-[10px] uppercase font-bold text-[#6B7280] mb-1">
                  Captured Speech:
                </div>
                <div className="text-[#111827] font-semibold italic bg-white p-3 rounded-xl border border-[#E5E7EB]">
                  "{transcript}"
                </div>
              </div>
            )}

            {parsedAnalysis && (
              <div className="text-[#047857] font-bold flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{parsedAnalysis}</span>
              </div>
            )}

            {parsedCategory && (
              <button
                type="button"
                onClick={handleApplyDonation}
                className="w-full h-12 min-h-[48px] rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md touch-manipulation mt-2"
              >
                Apply & Create Donation ({parsedCategory}) <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </MobileBottomSheet>
  );
};
