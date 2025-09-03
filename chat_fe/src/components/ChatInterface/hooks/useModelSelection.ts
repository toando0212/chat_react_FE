import { useState } from 'react';
import type { Model } from '../types';

const useModelSelection = (initialModel: string, models: Model[]) => {
  const [selectedModel, setSelectedModel] = useState<string>(
    localStorage.getItem('selectedModel') || initialModel
  );

  const handleModelSelect = (modelValue: string) => {
    setSelectedModel(modelValue);
    localStorage.setItem('selectedModel', modelValue);
  };

  return { selectedModel, handleModelSelect };
};

export default useModelSelection;
