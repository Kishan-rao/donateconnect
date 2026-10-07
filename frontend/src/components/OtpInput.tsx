import React, { useRef, KeyboardEvent } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, length = 6 }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;

    const otpArray = value.split('');
    otpArray[index] = val[val.length - 1]; // take the last entered digit
    const newOtp = otpArray.join('').slice(0, length);
    onChange(newOtp);

    // Move to next input if there's a value
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const otpArray = value.split('');
      if (otpArray[index]) {
        // If there's a value, clear current
        otpArray[index] = '';
        onChange(otpArray.join(''));
      } else if (index > 0) {
        // If it's empty, focus previous and clear it
        inputRefs.current[index - 1]?.focus();
        otpArray[index - 1] = '';
        onChange(otpArray.join(''));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      // Focus the next empty input or the last one
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Pad the value string with spaces for rendering
  const paddedValue = value.padEnd(length, ' ');

  return (
    <div
      className="flex items-center justify-between gap-1.5 sm:gap-2.5 w-full max-w-sm mx-auto"
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={paddedValue[index] === ' ' ? '' : paddedValue[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="flex-1 min-w-0 max-w-[48px] h-12 sm:h-14 rounded-xl border-2 border-[#E5E7EB] bg-[#F9FAFB] text-center text-xl sm:text-2xl font-extrabold text-[#111827] focus:outline-none focus:border-[#7567E8] focus:bg-white focus:ring-2 focus:ring-[#7567E8]/20 transition-all shadow-xs"
        />
      ))}
    </div>
  );
};
