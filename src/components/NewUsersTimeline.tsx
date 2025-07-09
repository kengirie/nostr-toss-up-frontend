import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@/hooks/useNostr';
import { useNewUsers } from '@/hooks/useNewUsers';
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

export function NewUsersTimeline() {
  const { nostr } = useNostr();
  const { data: newUsersPubkeys, isLoading: isLoadingUsers, error: usersError } = useNewUsers();

  const { data: posts, isLoading: isLoadingPosts, error: postsError } = useQuery({
    queryKey: ['new-users-timeline', newUsersPubkeys],
    queryFn: async (c) => {
      if (!newUsersPubkeys || newUsersPubkeys.length === 0) {
        return [];
      }

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      const events = await nostr.query([
        { 
          kinds: [1], 
          authors: newUsersPubkeys,
          limit: 100
        }
      ], { signal });
      
      return events
        .filter(validateTextNote)
        .sort((a, b) => b.created_at - a.created_at);
    },
    enabled: !!newUsersPubkeys && newUsersPubkeys.length > 0,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });

  const isLoading = isLoadingUsers || isLoadingPosts;
  const error = usersError || postsError;

  if (error) {
    return (
      <div className="col-span-full">
        <Card className="border-dashed">
          <CardContent className="py-12 px-8 text-center">
            <div className="max-w-sm mx-auto space-y-6">
              <p className="text-muted-foreground">
                Failed to load new users posts. Try other relays?
              </p>
              <MultiRelaySelector className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
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
                No posts found from new users. Try other relays?
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