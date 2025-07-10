import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';

export function useIsolatedUsers() {
  return useQuery({
    queryKey: ['isolated-users'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      const response = await fetch('https://nostr-toss-up.konnichiha7898.workers.dev/isolated-users-pubkey', {
        signal
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch isolated users');
      }
      
      const npubArray: string[] = await response.json();
      
      // Convert npub to hex pubkeys
      const pubkeys = npubArray
        .map(npub => {
          try {
            const decoded = nip19.decode(npub);
            return decoded.type === 'npub' ? decoded.data : null;
          } catch {
            return null;
          }
        })
        .filter((pubkey): pubkey is string => pubkey !== null);
      
      return pubkeys;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}