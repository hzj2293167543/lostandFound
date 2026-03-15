import { FieldErrors } from 'react-hook-form';

export const getFirstError = (errors: FieldErrors) => {
  const firstError = Object.values(errors).find(Boolean);
  if (firstError?.message) {
    return firstError.message.toString();
  }
  return '';
};
