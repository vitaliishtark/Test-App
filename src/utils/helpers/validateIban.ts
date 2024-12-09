export const validateIBAN = (iban: string) => {
    // Simple regex for IBAN validation (more sophisticated checks can be added)
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/;
    return ibanRegex.test(iban);
  };
  