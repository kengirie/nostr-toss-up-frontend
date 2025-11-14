import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { useNostr } from '@/hooks/useNostr';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoggedInAccounts } from '@/hooks/useLoggedInAccounts';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import LoginDialog from '@/components/auth/LoginDialog';
import { genUserName } from '@/lib/genUserName';

interface UserCardProps {
  pubkey: string;
}

function UserCard({ pubkey }: UserCardProps) {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { currentUser } = useLoggedInAccounts();
  const { mutate: createEvent, isPending: isPublishing } = useNostrPublish();
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;
  const displayName = metadata?.display_name || metadata?.name || genUserName(pubkey);
  const userName = metadata?.display_name ? metadata?.name : undefined;
  const npub = nip19.npubEncode(pubkey);

  // Get current user's follow list (kind 3)
  const { data: followList, refetch: refetchFollowList } = useQuery({
    queryKey: ['follow-list', currentUser?.pubkey],
    queryFn: async (c) => {
      if (!currentUser?.pubkey) return null;
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      const events = await nostr.query([
        { kinds: [3], authors: [currentUser.pubkey], limit: 1 }
      ], { signal });

      return events[0] || null;
    },
    enabled: !!currentUser?.pubkey,
  });

  // Check if current user is following this profile
  const isFollowing = followList?.tags.some((tag: string[]) =>
    tag[0] === 'p' && tag[1] === pubkey
  ) || false;

  const handleFollowToggle = async () => {
    // UI表示用のチェック（currentUserを使用）
    if (!currentUser?.pubkey) {
      setLoginDialogOpen(true);
      return;
    }

    // イベント作成用のチェック（userのsignerが必要）
    if (!user) {
      return;
    }

    if (!pubkey) return;

    const currentTags = followList?.tags || [];
    let newTags;

    if (isFollowing) {
      // Unfollow: remove the p tag for this pubkey
      newTags = currentTags.filter((tag: string[]) =>
        !(tag[0] === 'p' && tag[1] === pubkey)
      );
    } else {
      // Follow: add new p tag for this pubkey
      newTags = [...currentTags, ['p', pubkey]];
    }

    createEvent({
      kind: 3,
      content: '',
      tags: newTags
    });

    // Refetch the follow list after updating
    setTimeout(() => {
      refetchFollowList();
    }, 1000);
  };

  const handleLogin = () => {
    setLoginDialogOpen(false);
  };

  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${npub}`} className="flex-shrink-0">
            <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={metadata?.picture} alt={displayName} />
              <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link to={`/profile/${npub}`} className="hover:underline min-w-0 flex-shrink">
                <p className="font-semibold text-sm truncate">{displayName}</p>
              </Link>
              {userName && (
                <span className="text-muted-foreground text-xs truncate">@{userName}</span>
              )}
            </div>
            {metadata?.about && (
              <p className="text-xs text-muted-foreground truncate mt-1">{metadata.about}</p>
            )}
          </div>
          <Button
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            onClick={handleFollowToggle}
            disabled={isPublishing}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardHeader>

      <LoginDialog
        isOpen={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLogin={handleLogin}
      />
    </Card>
  );
}

export default function Users() {
  const { nostr } = useNostr();

  useSeoMeta({
    title: 'New Users - のすとら胴上げ部',
    description: 'Discover new users on のすとら胴上げ部',
  });

  const { data: usersEvent, isLoading } = useQuery({
    queryKey: ['users-list'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      const events = await nostr.query([{
        kinds: [30078],
        '#d': ['nostr-tossup:recent-contacts'],
        limit: 1
      }], { signal });

      return events[0] || null;
    },
  });

  // Extract pubkeys from the event tags
  const pubkeys = usersEvent?.tags
    .filter((tag: string[]) => tag[0] === 'p')
    .map((tag: string[]) => tag[1])
    .filter(Boolean) || [];

  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">New Users</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : pubkeys.length > 0 ? (
        <div className="space-y-4">
          {pubkeys.map((pubkey) => (
            <UserCard key={pubkey} pubkey={pubkey} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No new users found</p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
