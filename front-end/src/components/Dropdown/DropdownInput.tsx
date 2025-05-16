import React, { useState } from "react";
import ChevronDownIcon from "../../assets/icons/arrow-down.svg?react";
import ChevronUpIcon from "../../assets/icons/arrow-up.svg?react";

import AccountIcon from "../../assets/icons/Account.svg?react";

interface DropdownProps {
  label: string;
  options: string[];
  className?: string;
  variant?: string;

  onSelect?: (value: string) => void;
}

const DropdownInput: React.FC<DropdownProps> = ({
  label,
  options,
  className,
  variant,
  onSelect,
}) => {
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
        className="w-full h-10 px-2 text-light_text_primary light_border border-gray-300 rounded-lg transition-all duration-300 ease-in-out hover:rounded-xl flex items-center justify-between cursor-pointer"
      >
        {variant === "account" && <AccountIcon />}
        <span className="flex-1 min-w-0 px-2 truncate">
          {selected || label}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-8 h-8 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="w-8 h-8 flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 bg-light_main light_border z-10 w-full rounded-lg transition-all duration-300 ease-in-out">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full px-2 py-2 hover:bg-gray-100 transition-all duration-300 ease-in-out flex justify-center items-center text-center"
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
