import { useState } from 'react';

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValuesState] = useState<T>(initialValues);

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
  };

  const setValues = (newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  };

  const resetForm = () => {
    setValuesState(initialValues);
  };

  const getValue = <K extends keyof T>(field: K): T[K] => {
    return values[field];
  };

  return {
    values,
    setValue,
    setValues,
    resetForm,
    getValue,
  };
}