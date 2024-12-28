/**
 * Generates a random 6-digit numeric verification code as a string.
 *
 * This function creates a random 6-digit number by generating a random number
 * between 100000 and 999999 (inclusive). The result is then converted to a string
 * @returns {string} A 6-digit random verification code as a string.
 *
 * @example
 * const code = generateCode();
 * console.log(code); // Example output: "834729"
 */
export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
