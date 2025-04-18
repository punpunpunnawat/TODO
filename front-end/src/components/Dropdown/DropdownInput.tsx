import React, { useState } from "react";

interface DropdownProps {
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
  className?: string; // Add className prop
}

const DropdownInput: React.FC<DropdownProps> = ({ label, options, onSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div className={`relative ${className}`}> {/* Apply className prop to parent */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 bg-light_main text-light_text_primary light_border border-gray-300 px-4 py-2 text-left rounded-lg transition-all duration-300 ease-in-out hover:rounded-xl"
      >
        {selected || label}
      </button>

      {isOpen && (
        <div className="absolute left-0 bg-light_main light_border z-10 w-full rounded-lg transition-all duration-300 ease-in-out">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownInput;
