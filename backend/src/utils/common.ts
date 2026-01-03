const ALPHABET_AND_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateToken = (number = 30): string => {
  let text = "";
  for (let i = 0; i < number; i++)
    text += ALPHABET_AND_DIGITS.charAt(Math.floor(Math.random() * ALPHABET_AND_DIGITS.length));
  return text;
};

export const escapeRegExp = (pattern: string): string => {
  return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim();
};

export const replaceDoubleBraces = <T extends Record<string, unknown>>(str: string, result: T): string => {
  return str.replace(/{{(.+?)}}/g, (_, g1: string) => {
    if (g1 in result) {
      return String(result[g1]);
    }
    return g1;
  });
};

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "-");
}

export function generateRandomNumber(length = 6): number {
  const minm = Math.pow(10, length - 1);
  const maxm = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}
