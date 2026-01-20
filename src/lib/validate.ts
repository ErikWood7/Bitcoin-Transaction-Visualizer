/**
 * Validation utilities for Bitcoin-related inputs
 */

/**
 * Check if a string is likely a transaction ID (txid)
 * @param input - String to check
 * @returns true if input is 64-character hex string
 */
export function isLikelyTxid(input: string): boolean {
  // Transaction IDs are 64-character hexadecimal strings
  const txidPattern = /^[a-fA-F0-9]{64}$/;
  return txidPattern.test(input);
}

/**
 * Check if a string is likely a Bitcoin address
 * Supports common address formats:
 * - Legacy (P2PKH): starts with '1'
 * - SegWit (P2SH): starts with '3'
 * - Bech32 (native SegWit): starts with 'bc1'
 * @param input - String to check
 * @returns true if input matches common Bitcoin address patterns
 */
export function isLikelyBtcAddress(input: string): boolean {
  // Legacy P2PKH addresses: start with '1', 26-35 characters
  const legacyPattern = /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // P2SH addresses: start with '3', 26-35 characters
  const p2shPattern = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // Bech32 native SegWit: start with 'bc1', 42-62 characters
  const bech32Pattern = /^bc1[a-z0-9]{39,59}$/;
  
  // Testnet Bech32: start with 'tb1'
  const testnetBech32Pattern = /^tb1[a-z0-9]{39,59}$/;
  
  return (
    legacyPattern.test(input) ||
    p2shPattern.test(input) ||
    bech32Pattern.test(input) ||
    testnetBech32Pattern.test(input)
  );
}

/**
 * Detect the type of input string
 * @param input - String to analyze
 * @returns 'txid' | 'address' | 'unknown'
 */
export function detectInputType(input: string): 'txid' | 'address' | 'unknown' {
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return 'unknown';
  }
  
  if (isLikelyTxid(trimmed)) {
    return 'txid';
  }
  
  if (isLikelyBtcAddress(trimmed)) {
    return 'address';
  }
  
  return 'unknown';
}
