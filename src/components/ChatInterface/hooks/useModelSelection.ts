import { useState } from 'react';
import type { Model } from '../types';

const useModelSelection = (initialModel: string, models: Model[]) => {
  const [selectedModel, setSelectedModel] = useState<string>(
    localStorage.getItem('selectedModel') || initialModel
  );

  const handleModelSelect = (modelValue: string) => {
    if (models.some((model) => model.value === modelValue)) {
      setSelectedModel(modelValue);
      localStorage.setItem('selectedModel', modelValue);
    } else {
      console.warn(`Model "${modelValue}" is not in the list of available models.`);
    }
  };

  return { selectedModel, handleModelSelect };
};

export default useModelSelection;
