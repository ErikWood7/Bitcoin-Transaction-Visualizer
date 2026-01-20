# Security Documentation

## API Keys

This application uses public APIs that **do not require API keys**:
- **CoinGecko API**: Free tier, no API key required
- **Mempool.space API**: Public API, no API key required

### If Using API Keys in the Future

If you need to use API keys (e.g., for CoinGecko Pro tier), follow these guidelines:

1. **Never commit API keys to version control**
   - Add `.env.local` to `.gitignore` (already included)
   - Use environment variables for all sensitive data

2. **Use environment variables**
   ```bash
   # .env.local (not committed)
   COINGECKO_API_KEY=your_key_here
   ```

3. **Access in code**
   ```typescript
   const apiKey = process.env.COINGECKO_API_KEY;
   // Never log or expose API keys
   ```

4. **Server-side only**
   - API keys should only be used in server-side code (API routes)
   - Never expose API keys to client-side code

## Rate Limiting

All API routes implement rate limiting to prevent abuse:

- **Transaction endpoints** (`/api/tx/[txid]`, `/api/address/[addr]`, `/api/address/[addr]/txs`):
  - 30 requests per minute per IP address
- **Price endpoints** (`/api/btc-price`, `/api/btc-price-history`):
  - 60 requests per minute per IP address

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: When the rate limit resets
- `Retry-After`: Seconds to wait before retrying (on 429 errors)

## Input Validation

All user inputs are validated and sanitized:

1. **Transaction IDs**: Must be exactly 64 hexadecimal characters
2. **Bitcoin Addresses**: Validated against known address formats (Legacy, P2SH, Bech32)
3. **Query Parameters**: Validated for type, length, and malicious patterns

### Validation Checks

- Length limits (prevents DoS attacks)
- Format validation (prevents invalid queries)
- Malicious pattern detection:
  - SQL injection attempts
  - XSS (Cross-Site Scripting) attempts
  - Command injection attempts

Invalid inputs return `400 Bad Request` with descriptive error messages.

## Security Best Practices

1. **Input Sanitization**: All inputs are trimmed and validated before processing
2. **Error Handling**: Generic error messages prevent information leakage
3. **Rate Limiting**: Prevents abuse and DoS attacks
4. **Caching**: Reduces load on external APIs
5. **No Sensitive Data in Logs**: API keys and sensitive data are never logged

## Environment Variables

Create a `.env.local` file (not committed to git) for local configuration:

```bash
# Use mock data for development
USE_MOCK_DATA=0

# Future: API keys (if needed)
# COINGECKO_API_KEY=your_key_here
```

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly.
