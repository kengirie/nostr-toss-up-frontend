import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';

export function useNewUsers() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['new-users'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      // Query for kind 30078 event with d tag "nostr-tossup:recent-contacts"
      const events = await nostr.query([{
        kinds: [30078],
        '#d': ['nostr-tossup:recent-contacts'],
        limit: 1
      }], { signal });
      
      if (events.length === 0) {
        return [];
      }
      
      // Get the most recent event (events are sorted by created_at desc by default)
      const recentContactsEvent = events[0];
      
      // Extract pubkeys from p tags
      const pubkeys = recentContactsEvent.tags
        .filter(tag => tag[0] === 'p' && tag[1])
        .map(tag => tag[1]);
      
      return pubkeys;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}