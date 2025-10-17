import { useState } from 'react';
import { ZodError, ZodSchema } from 'zod';

export function useFormValidation<T extends Record<string, any>>(schema: ZodSchema<T>) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = (data: T): { isValid: boolean; errors: Partial<Record<keyof T, string>>; firstError?: string } => {
    try {
      setFieldErrors({});
      schema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Partial<Record<keyof T, string>> = {};
        
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T;
          if (!errors[field]) {
            errors[field] = err.message;
          }
        });
        
        setFieldErrors(errors);
        const firstError = Object.values(errors)[0] as string;
        
        return { isValid: false, errors, firstError };
      }
      return { isValid: false, errors: {}, firstError: "Validation failed" };
    }
  };

  const clearFieldError = (field: keyof T) => {
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const clearAllErrors = () => {
    setFieldErrors({});
  };

  const hasError = (field: keyof T): boolean => {
    return !!fieldErrors[field];
  };

  const getError = (field: keyof T): string | undefined => {
    return fieldErrors[field];
  };

  return {
    fieldErrors,
    validate,
    clearFieldError,
    clearAllErrors,
    hasError,
    getError,
  };
}