import type { BTCProvider } from './provider';
import { MempoolProvider } from './mempool';

let providerInstance: BTCProvider | null = null;

/**
 * Get the configured BTC provider
 * Uses Mempool.space by default
 */
export function getBTCProvider(): BTCProvider {
  if (providerInstance) {
    return providerInstance;
  }

  // For now, always use Mempool.space
  // In the future, this could check env vars to choose provider
  providerInstance = new MempoolProvider();
  return providerInstance;
}

/**
 * Set a custom provider (useful for testing)
 */
export function setBTCProvider(provider: BTCProvider): void {
  providerInstance = provider;
}
