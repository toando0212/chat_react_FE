import React, { useState, useRef, useEffect } from 'react';
import type { Model } from '../types';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelSelect: (modelValue: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, onModelSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleModelClick = (modelValue: string) => {
    onModelSelect(modelValue);
    setIsOpen(false); // Close dropdown after selection
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="custom-dropdown" ref={wrapperRef}>
      <button className="dropdown-toggle-btn" onClick={toggleDropdown}>
        🤖 {models.find((m) => m.value === selectedModel)?.name || 'Select Model'}
        <span>▼</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu-custom">
          {models.map((model) => (
            <li key={model.value}>
              <button className="dropdown-item-custom" onClick={() => handleModelClick(model.value)}>
                {model.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModelSelector;
