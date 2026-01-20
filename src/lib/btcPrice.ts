/**
 * Fetch Bitcoin price in USD
 * Uses CoinGecko API as a reliable source
 */

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

let cachedPrice: number | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

/**
 * Fetch current Bitcoin price in USD
 * Caches the result for 1 minute
 */
export async function getBTCPrice(): Promise<number | null> {
  const now = Date.now();
  
  // Return cached price if still valid
  if (cachedPrice !== null && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedPrice;
  }

  try {
    const response = await fetch(COINGECKO_API, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      console.warn('Failed to fetch BTC price:', response.statusText);
      return cachedPrice; // Return stale cache if available
    }

    const data = await response.json();
    const price = data.bitcoin?.usd;

    if (typeof price === 'number' && price > 0) {
      cachedPrice = price;
      cacheTimestamp = now;
      return price;
    }

    return cachedPrice; // Return stale cache if available
  } catch (error) {
    console.warn('Error fetching BTC price:', error);
    return cachedPrice; // Return stale cache if available
  }
}

/**
 * Get cached BTC price without fetching (for client-side use)
 */
export function getCachedBTCPrice(): number | null {
  return cachedPrice;
}
