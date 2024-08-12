/**
 * Validates a mobile number to ensure it is exactly 10 digits long.
 *
 * This function uses a regular expression to check if the input string consists of exactly 10 numeric digits.
 *
 * @param {string} mobileNumber - The mobile number to validate.
 * @returns {boolean} - Returns `true` if the mobile number is exactly 10 digits long, otherwise returns `false`.
 *
 * @example
 * // Valid mobile number
 * const isValid = validateMobileNumber('1234567890');
 * console.log(isValid); // true
 *
 * @example
 * // Invalid mobile number (less than 10 digits)
 * const isValid = validateMobileNumber('123456789');
 * console.log(isValid); // false
 *
 * @example
 * // Invalid mobile number (more than 10 digits)
 * const isValid = validateMobileNumber('12345678901');
 * console.log(isValid); // false
 *
 * @example
 * // Invalid mobile number (contains non-numeric characters)
 * const isValid = validateMobileNumber('12345abcde');
 * console.log(isValid); // false
 */
const validateMobileNumber = (mobileNumber: string): boolean => {
    const phoneRegex: RegExp = /^\d{10}$/;

    return phoneRegex.test(mobileNumber);
};

export default validateMobileNumber;
