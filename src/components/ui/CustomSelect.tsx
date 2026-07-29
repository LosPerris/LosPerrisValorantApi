import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

type DropdownPos = { top: number; left: number; width: number; above: boolean };

export default function CustomSelect({ id, value, onChange, options, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<DropdownPos | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(o => o.value === value) || options[0];

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!buttonRef.current?.contains(target) && !document.getElementById('custom-select-portal')?.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  // Cerrar al hacer scroll (evita que el dropdown flote desacoplado del botón)
  useEffect(() => {
    if (!isOpen) return;
    const handle = () => setIsOpen(false);
    window.addEventListener('scroll', handle, true);
    return () => window.removeEventListener('scroll', handle, true);
  }, [isOpen]);

  const recalcPos = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const estimatedHeight = options.length * 36 + 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < estimatedHeight + 8;
    setPos({
      top: above ? rect.top - estimatedHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      above,
    });
  };

  const handleToggle = () => {
    if (!isOpen) recalcPos();
    setIsOpen(prev => !prev);
  };

  return (
    <div className="relative group">
      <button
        type="button"
        id={id}
        ref={buttonRef}
        onClick={handleToggle}
        className={cn(
          'w-full text-left px-3 py-2 rounded-lg text-sm text-white outline-none transition cursor-pointer flex justify-between items-center',
          'bg-[#111] border',
          isOpen ? 'border-[#ff4655] ring-1 ring-[#ff4655]' : 'border-white/10 hover:border-[#ff4655]/50',
          className
        )}
      >
        {selectedOption?.label}
        <span className={cn('transition-colors pointer-events-none', isOpen ? 'text-[#ff4655]' : 'text-neutral-500 group-hover:text-[#ff4655]')}>
          <iconify-icon icon={isOpen ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} width="14"></iconify-icon>
        </span>
      </button>

      {isOpen && pos && typeof document !== 'undefined' && createPortal(
        <div
          id="custom-select-portal"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-[#111] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors',
                option.value === value
                  ? 'bg-[#ff4655]/10 text-[#ff4655] font-semibold border-l-2 border-[#ff4655]'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
