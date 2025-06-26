import React, { useEffect, useRef } from 'react';
import { NostrEvent, NPool, NRelay1 } from '@nostrify/nostrify';
import { NostrContext } from '@nostrify/react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@/hooks/useAppContext';

interface NostrProviderProps {
  children: React.ReactNode;
}

const NostrProvider: React.FC<NostrProviderProps> = (props) => {
  const { children } = props;
  const { config } = useAppContext();

  const queryClient = useQueryClient();

  // Create NPool instance only once
  const pool = useRef<NPool | undefined>(undefined);

  // Update when selectedRelays changes
  useEffect(() => {
    queryClient.resetQueries();
  }, [config.selectedRelays, queryClient]);

  // Initialize NPool only once
  if (!pool.current) {
    pool.current = new NPool({
      open(url: string) {
        return new NRelay1(url);
      },
      reqRouter(filters) {
        // Use selected relays for queries
        const selectedRelays = config.selectedRelays;

        // Create map with selected relays using the same filters
        const relayMap = new Map<string, typeof filters>();
        for (const relay of selectedRelays) {
          relayMap.set(relay, filters);
        }

        return relayMap;
      },
      eventRouter(_event: NostrEvent) {
        // Publish to selected relays (same as query relays)
        const selectedRelays = config.selectedRelays;
        return selectedRelays;
      },
    });
  }

  return (
    <NostrContext.Provider value={{ nostr: pool.current }}>
      {children}
    </NostrContext.Provider>
  );
};

export default NostrProvider;
