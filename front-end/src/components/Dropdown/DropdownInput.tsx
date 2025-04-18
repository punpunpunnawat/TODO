import React, { useState } from "react";

interface DropdownProps {
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
}

const DropdownInput: React.FC<DropdownProps> = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div className="relative flex">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-40 h-10 bg-light_main text-light_text_primary light_border border-gray-300"
        >
            {selected || label}
        </button>

        {isOpen && (
            <div className="absolute w-full bg-light_main light_border z-10">
            {options.map((option) => (
                <button
                key={option}
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
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
