/**
 * Enhanced input validation for API routes
 * Prevents malicious inputs and injection attacks
 */

import { isLikelyTxid, isLikelyBtcAddress } from './validate';

const MAX_INPUT_LENGTH = 200; // Maximum length for any input
const MAX_TXID_LENGTH = 64;
const MAX_ADDRESS_LENGTH = 100;

/**
 * Sanitize and validate transaction ID
 */
export function validateTxid(txid: string): { valid: boolean; error?: string; sanitized?: string } {
  if (!txid || typeof txid !== 'string') {
    return { valid: false, error: 'Transaction ID is required' };
  }

  // Trim whitespace
  const sanitized = txid.trim();

  // Check length
  if (sanitized.length === 0) {
    return { valid: false, error: 'Transaction ID cannot be empty' };
  }

  if (sanitized.length > MAX_TXID_LENGTH) {
    return { valid: false, error: 'Transaction ID is too long' };
  }

  // Check for malicious patterns (SQL injection, XSS, etc.)
  if (containsMaliciousPatterns(sanitized)) {
    return { valid: false, error: 'Invalid characters in transaction ID' };
  }

  // Validate format
  if (!isLikelyTxid(sanitized)) {
    return { valid: false, error: 'Invalid transaction ID format' };
  }

  return { valid: true, sanitized };
}

/**
 * Sanitize and validate Bitcoin address
 */
export function validateAddress(address: string): { valid: boolean; error?: string; sanitized?: string } {
  if (!address || typeof address !== 'string') {
    return { valid: false, error: 'Address is required' };
  }

  // Trim whitespace
  const sanitized = address.trim();

  // Check length
  if (sanitized.length === 0) {
    return { valid: false, error: 'Address cannot be empty' };
  }

  if (sanitized.length > MAX_ADDRESS_LENGTH) {
    return { valid: false, error: 'Address is too long' };
  }

  // Check for malicious patterns
  if (containsMaliciousPatterns(sanitized)) {
    return { valid: false, error: 'Invalid characters in address' };
  }

  // Validate format
  if (!isLikelyBtcAddress(sanitized)) {
    return { valid: false, error: 'Invalid Bitcoin address format' };
  }

  return { valid: true, sanitized };
}

/**
 * Check for malicious patterns in input
 * Note: This is conservative - Bitcoin addresses may contain some of these characters
 * but in valid formats, so we only check for clearly malicious patterns
 */
function containsMaliciousPatterns(input: string): boolean {
  // SQL injection patterns (only check for SQL keywords, not quotes which are valid in addresses)
  const sqlPatterns = [
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b/i,
    /(xp_|sp_)/i,
  ];

  // XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  // Command injection patterns (only check for command words, not special chars used in addresses)
  const commandPatterns = [
    /\b(cat|ls|pwd|whoami|id|uname|curl|wget|nc|netcat)\s/i, // Only if followed by space (likely command)
  ];

  // Check for null bytes or other dangerous characters
  const dangerousChars = [
    /\0/, // Null byte
    /\x00/, // Null byte (hex)
  ];

  const allPatterns = [...sqlPatterns, ...xssPatterns, ...commandPatterns, ...dangerousChars];

  return allPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate general string input
 */
export function validateStringInput(
  input: string,
  maxLength: number = MAX_INPUT_LENGTH
): { valid: boolean; error?: string; sanitized?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input is required' };
  }

  const sanitized = input.trim();

  if (sanitized.length === 0) {
    return { valid: false, error: 'Input cannot be empty' };
  }

  if (sanitized.length > maxLength) {
    return { valid: false, error: `Input exceeds maximum length of ${maxLength} characters` };
  }

  if (containsMaliciousPatterns(sanitized)) {
    return { valid: false, error: 'Invalid characters in input' };
  }

  return { valid: true, sanitized };
}
