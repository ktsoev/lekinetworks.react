export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidCode = (code: string): boolean =>
  /^\d{6}$/.test(code);
