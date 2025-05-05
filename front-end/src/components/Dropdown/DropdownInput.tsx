import React, { useState } from "react";

interface DropdownProps {
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
  className?: string;
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
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-4 bg-light_main text-light_text_primary light_border border-gray-300 rounded-lg transition-all duration-300 ease-in-out hover:rounded-xl flex items-center justify-center text-center"
      >
        {selected || label}
      </button>

      {isOpen && (
        <div className="absolute left-0 bg-light_main light_border z-10 w-full rounded-lg transition-all duration-300 ease-in-out">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-2 hover:bg-gray-100 transition-all duration-300 ease-in-out flex justify-center items-center text-center"
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
