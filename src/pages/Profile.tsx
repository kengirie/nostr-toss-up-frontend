import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSeoMeta } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { useNostr } from '@/hooks/useNostr';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoggedInAccounts } from '@/hooks/useLoggedInAccounts';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/components/Post';
import { LoginArea } from '@/components/auth/LoginArea';
import LoginDialog from '@/components/auth/LoginDialog';
import { genUserName } from '@/lib/genUserName';
import { Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RelaySettingsButton } from '@/components/RelaySettingsButton';
import type { NostrEvent } from '@nostrify/nostrify';

function validateTextNote(event: NostrEvent): boolean {
  if (event.kind !== 1) return false;
  if (!event.content) return false;
  return true;
}

export default function Profile() {
  const { nip19: nip19Param } = useParams<{ nip19: string }>();
  const { user } = useCurrentUser();
  const { currentUser } = useLoggedInAccounts();
  const { nostr } = useNostr();
  const { mutate: createEvent, isPending: isPublishing } = useNostrPublish();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  let pubkey = '';
  let isValidNip19 = false;

  try {
    if (nip19Param) {
      const decoded = nip19.decode(nip19Param);
      if (decoded.type === 'npub') {
        pubkey = decoded.data;
        isValidNip19 = true;
      }
    }
  } catch (error) {
    console.error('Invalid NIP-19 identifier:', error);
  }

  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;
  const displayName = metadata?.name || genUserName(pubkey);

  useSeoMeta({
    title: `${displayName} - のすとら胴上げ部`,
    description: metadata?.about || `Profile of ${displayName} on のすとら胴上げ部`,
  });

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

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', pubkey],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      const events = await nostr.query([
        { kinds: [1], authors: [pubkey], limit: 50 }
      ], { signal });

      return events
        .filter(validateTextNote)
        .sort((a, b) => b.created_at - a.created_at);
    },
    enabled: !!pubkey && isValidNip19,
  });

  if (!isValidNip19 || !pubkey) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto max-w-2xl px-4 h-16">
            <div className="flex items-center justify-between h-full">
              <Link to="/">
                <div className="flex items-center gap-2 pl-3 hover:opacity-80 transition-opacity cursor-pointer">
                <img src="/douage.png" alt="のすとら胴上げ部" className="w-8 h-8" />
                <h1 className="text-xl font-bold">のすとら胴上げ部</h1>
              </div>
              </Link>
              <div className="flex items-center gap-2">
                <RelaySettingsButton />
                <LoginArea className="max-w-60" />
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto max-w-2xl px-4 py-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Invalid profile identifier</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-2xl px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <Link to="/">
              <div className="flex items-center gap-2 pl-3 hover:opacity-80 transition-opacity cursor-pointer">
                <img src="/douage.png" alt="のすとら胴上げ部" className="w-8 h-8" />
                <h1 className="text-xl font-bold">のすとら胴上げ部</h1>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <RelaySettingsButton/>
              <LoginArea className="max-w-60" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4">
        {/* Profile Header */}
        <Card className="mt-6">
          <CardContent className="p-0">
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
              {metadata?.banner && (
                <img
                  src={metadata.banner}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-t-lg"
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className="h-20 w-20 -mt-10 border-4 border-background">
                  <AvatarImage src={metadata?.picture} alt={displayName} />
                  <AvatarFallback className="text-2xl">
                    {displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <Button
                  variant={isFollowing ? "default" : "outline"}
                  onClick={handleFollowToggle}
                  disabled={isPublishing}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>

              <div className="space-y-2">
                <div>
                  <h2 className="text-xl font-bold truncate">{displayName}</h2>
                </div>

                {metadata?.about && (
                  <p className="text-sm text-muted-foreground break-words">{metadata.about}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {metadata?.website && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={metadata.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                      >
{metadata.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Posts</h3>

          {postsLoading ? (
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <Post key={post.id} event={post} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No posts yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <LoginDialog
        isOpen={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
