import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export default function CustomSelect({ id, value, onChange, options, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative group" ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full text-left px-3 py-2.5 rounded-lg text-sm text-white outline-none transition cursor-pointer flex justify-between items-center",
          "bg-[#0a0a0d] border",
          isOpen ? "border-[#ff4655] ring-1 ring-[#ff4655]" : "border-[#2a2a30] hover:border-[#ff4655]",
          className
        )}
      >
        {selectedOption?.label}
        <span className={cn(
          "transition-colors pointer-events-none",
          isOpen ? "text-[#ff4655]" : "text-neutral-500 group-hover:text-[#ff4655]"
        )}>
          <iconify-icon icon={isOpen ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} width="14"></iconify-icon>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#0a0a0d] border border-[#2a2a30] rounded-lg shadow-xl overflow-hidden py-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2.5 text-sm transition-colors",
                option.value === value 
                  ? "bg-[#ff4655]/20 text-[#ff4655] font-semibold" 
                  : "text-white hover:bg-[#ff4655] hover:text-white"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
