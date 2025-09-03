import React from 'react';
import type { Model } from '../types';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelSelect: (modelValue: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, onModelSelect }) => {
  return (
    <div className="custom-dropdown">
      <button className="dropdown-toggle-btn" onClick={() => {}}>
        🤖 {models.find((m) => m.value === selectedModel)?.name || 'Select Model'}
        <span>▼</span>
      </button>
      <ul className="dropdown-menu-custom">
        {models.map((model) => (
          <li key={model.value}>
            <button className="dropdown-item-custom" onClick={() => onModelSelect(model.value)}>
              {model.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelSelector;
