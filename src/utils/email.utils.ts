

export const normalizeEmail = (email: string): string => {
  const [localPart, domain] = email.toLowerCase().split('@');
  return `${localPart.replace(/\./g, '')}@${domain}`;
};
