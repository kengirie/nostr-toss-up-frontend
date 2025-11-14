import { nip19 } from 'nostr-tools';

/**
 * Return the user's npub as the fallback display name.
 * Falls back to the raw seed if encoding fails.
 */
export function genUserName(seed: string): string {
  try {
    return nip19.npubEncode(seed);
  } catch (error) {
    console.warn('Failed to encode pubkey to npub:', error);
    return seed;
  }
}
