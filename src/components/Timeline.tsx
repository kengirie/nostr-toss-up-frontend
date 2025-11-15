import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@/hooks/useNostr';
import { Post } from '@/components/Post';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MultiRelaySelector } from '@/components/MultiRelaySelector';
import type { NostrEvent } from '@nostrify/nostrify';

function validateTextNote(event: NostrEvent): boolean {
  if (event.kind !== 1) return false;
  if (!event.content) return false;
  return true;
}

export function Timeline() {
  const { nostr } = useNostr();
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['timeline'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      const limit = 50;
      const seen = new Set<string>();
      let events: NostrEvent[] = [];

      queryClient.setQueryData(['timeline'], [] as NostrEvent[]);

      try {
        for await (const msg of nostr.req([{ kinds: [1], limit }], { signal })) {
          if (msg[0] === 'EVENT') {
            const event = msg[2];
            if (!validateTextNote(event) || seen.has(event.id)) continue;

            seen.add(event.id);
            events = [...events, event]
              .sort((a, b) => b.created_at - a.created_at)
              .slice(0, limit);

            queryClient.setQueryData(['timeline'], events);

            if (events.length >= limit) {
              break;
            }
          }

          if (msg[0] === 'EOSE' || msg[0] === 'CLOSED') {
            break;
          }
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          throw err;
        }
      }

      return events;
    },
    refetchInterval: 30000,
  });

  if (error && (!posts || posts.length === 0)) {
    return (
      <div className="col-span-full">
        <Card className="border-dashed">
          <CardContent className="py-12 px-8 text-center">
            <div className="max-w-sm mx-auto space-y-6">
              <p className="text-muted-foreground">
                Failed to load posts. Try other relays?
              </p>
              <MultiRelaySelector className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && (!posts || posts.length === 0)) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                  <div className="flex space-x-6 pt-2">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="col-span-full">
        <Card className="border-dashed">
          <CardContent className="py-12 px-8 text-center">
            <div className="max-w-sm mx-auto space-y-6">
              <p className="text-muted-foreground">
                No posts found. Try other relays?
              </p>
              <MultiRelaySelector className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} event={post} />
      ))}
    </div>
  );
}
