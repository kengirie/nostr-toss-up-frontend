import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSeoMeta } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { useNostr } from '@/hooks/useNostr';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/components/Post';
import { LoginArea } from '@/components/auth/LoginArea';
import { EditProfileForm } from '@/components/EditProfileForm';
import { genUserName } from '@/lib/genUserName';
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NostrEvent } from '@nostrify/nostrify';

function validateTextNote(event: NostrEvent): boolean {
  if (event.kind !== 1) return false;
  if (!event.content) return false;
  return true;
}

export default function Profile() {
  const { nip19: nip19Param } = useParams<{ nip19: string }>();
  const { user } = useCurrentUser();
  const { nostr } = useNostr();

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
  const isOwnProfile = user?.pubkey === pubkey;

  useSeoMeta({
    title: `${displayName} - Nostr Social`,
    description: metadata?.about || `Profile of ${displayName} on Nostr Social`,
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
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-xl font-bold">Profile</h1>
              </div>
              <LoginArea className="max-w-60" />
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{displayName}</h1>
                <p className="text-sm text-muted-foreground">
                  {posts?.length || 0} posts
                </p>
              </div>
            </div>
            <LoginArea className="max-w-60" />
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
                
                {isOwnProfile ? (
                  <EditProfileForm />
                ) : (
                  <Button variant="outline">Follow</Button>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <h2 className="text-xl font-bold">{displayName}</h2>
                  {metadata?.nip05 && (
                    <Badge variant="secondary" className="mt-1">
                      {metadata.nip05}
                    </Badge>
                  )}
                </div>
                
                {metadata?.about && (
                  <p className="text-sm text-muted-foreground">{metadata.about}</p>
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
                  
                  {metadata?.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{metadata.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(author.data?.created_at || 0)}</span>
                  </div>
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
    </div>
  );
}