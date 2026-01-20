import type { Sats } from './types/btc';

/**
 * Format satoshis to BTC string
 * @param sats - Amount in satoshis
 * @returns Formatted string like "0.00123456 BTC"
 */
export function satsToBtcString(sats: Sats): string {
  const btc = sats / 100_000_000;
  // Format with up to 8 decimal places, removing trailing zeros
  const formatted = btc.toFixed(8).replace(/\.?0+$/, '');
  return `${formatted} BTC`;
}

/**
 * Format satoshis to USD string
 * @param sats - Amount in satoshis
 * @param btcUsd - Optional BTC price in USD (defaults to placeholder)
 * @returns Formatted string like "$45.67 USD" or "~$45.67 USD (est.)"
 */
export function satsToUsdString(sats: Sats, btcUsd?: number): string {
  if (btcUsd === undefined || btcUsd <= 0) {
    return 'USD price unavailable';
  }
  
  const btc = sats / 100_000_000;
  const usd = btc * btcUsd;
  
  // Format with 2 decimal places for USD
  return `$${usd.toFixed(2)} USD`;
}

/**
 * Format Unix timestamp to readable string
 * @param unixSeconds - Unix timestamp in seconds
 * @returns Formatted string like "Jan 15, 2024 10:30 AM"
 */
export function formatTimestamp(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a large number with commas
 * @param num - Number to format
 * @returns Formatted string like "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format satoshis with commas
 * @param sats - Amount in satoshis
 * @returns Formatted string like "1,234,567 sats"
 */
export function formatSats(sats: Sats): string {
  return `${formatNumber(sats)} sats`;
}
