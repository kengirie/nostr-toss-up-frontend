import { describe, it, expect } from 'vitest';
import { nip19 } from 'nostr-tools';
import { genUserName } from './genUserName';

describe('genUserName', () => {
  it('returns the npub representation for valid pubkeys', () => {
    const pubkey = 'e4690a13290739da123aa17d553851dec4cdd0e9d89aa18de3741c446caf8761';
    const expected = nip19.npubEncode(pubkey);

    expect(genUserName(pubkey)).toEqual(expected);
  });

  it('is deterministic for the same pubkey input', () => {
    const pubkey = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const first = genUserName(pubkey);
    const second = genUserName(pubkey);

    expect(first).toEqual(second);
  });

  it('falls back to the raw seed when encoding fails', () => {
    const invalidSeed = 'not-a-hex-key';

    expect(genUserName(invalidSeed)).toEqual(invalidSeed);
  });
});
