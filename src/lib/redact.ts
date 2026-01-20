/**
 * Privacy redaction utilities
 * Helps teach addresses without exposing full addresses
 */

/**
 * Truncate an address showing only first and last characters
 * @param address - Bitcoin address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 6)
 * @returns Truncated address like "bc1qxy...0wlh"
 */
export function truncateAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 6
): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}

/**
 * Get a label for an address based on its role
 * @param address - Bitcoin address
 * @param role - Role of the address (e.g., 'sender', 'recipient', 'change')
 * @param index - Index for multiple addresses of same role
 * @returns Label like "Sender A" or "Recipient"
 */
export function getAddressLabel(address: string, role: 'sender' | 'recipient' | 'change', index: number = 0): string {
  if (role === 'sender') {
    return `Sender ${String.fromCharCode(65 + index)}`; // A, B, C, etc.
  }
  if (role === 'change') {
    return 'Change';
  }
  return index === 0 ? 'Recipient' : `Recipient ${index + 1}`;
}

/**
 * Redact an address based on privacy mode
 * @param address - Bitcoin address
 * @param showFull - Whether to show full address
 * @param label - Optional label to use instead
 * @returns Redacted address or label
 */
export function redactAddress(address: string, showFull: boolean = false, label?: string): string {
  if (label && !showFull) {
    return label;
  }
  if (showFull) {
    return address;
  }
  return truncateAddress(address);
}
