import { useState } from 'react';
import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NoteContent } from '@/components/NoteContent';
import { ReplyBox } from '@/components/ReplyBox';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { genUserName } from '@/lib/genUserName';
import { Heart, MessageCircle, Repeat2, MoreHorizontal } from 'lucide-react';
import type { NostrEvent } from '@nostrify/nostrify';

interface PostProps {
  event: NostrEvent;
}

export function Post({ event }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const { user } = useCurrentUser();
  const { mutate: createEvent, isPending } = useNostrPublish();
  const author = useAuthor(event.pubkey);

  const metadata = author.data?.metadata;
  const displayName = metadata?.name || genUserName(event.pubkey);
  const profileImage = metadata?.picture;
  const about = metadata?.about;
  const npub = nip19.npubEncode(event.pubkey);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  const handleLike = () => {
    if (!user) return;

    createEvent({
      kind: 7,
      content: isLiked ? '' : '+',
      tags: [
        ['e', event.id],
        ['p', event.pubkey],
        ['k', '1']
      ]
    });

    setIsLiked(!isLiked);
  };

  const handleRepost = () => {
    if (!user) return;

    createEvent({
      kind: 6,
      content: '',
      tags: [
        ['e', event.id],
        ['p', event.pubkey]
      ]
    });

    setIsReposted(!isReposted);
  };

  const handleReply = () => {
    setShowReplyBox(!showReplyBox);
  };

  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Link to={`/profile/${npub}`}>
            <Avatar className="h-10 w-10 hover:opacity-80 transition-opacity">
              <AvatarImage src={profileImage} alt={displayName} />
              <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link to={`/profile/${npub}`} className="hover:underline">
                <p className="font-semibold text-sm truncate">{displayName}</p>
              </Link>
              {metadata?.nip05 && (
                <Badge variant="secondary" className="text-xs">
                  {metadata.nip05}
                </Badge>
              )}
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">
                {formatDate(event.created_at)}
              </span>
            </div>
            {about && (
              <p className="text-xs text-muted-foreground truncate mt-1">{about}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="whitespace-pre-wrap break-words mb-4">
          <NoteContent event={event} className="text-sm" />
        </div>

        <div className="flex items-center justify-between max-w-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReply}
            className="flex items-center space-x-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-full px-3"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">Reply</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRepost}
            disabled={isPending}
            className={`flex items-center space-x-2 rounded-full px-3 ${
              isReposted
                ? 'text-green-600 bg-green-50'
                : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <Repeat2 className="h-4 w-4" />
            <span className="text-sm">Repost</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isPending}
            className={`flex items-center space-x-2 rounded-full px-3 ${
              isLiked
                ? 'text-red-600 bg-red-50'
                : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">Like</span>
          </Button>
        </div>

        {showReplyBox && (
          <ReplyBox
            replyTo={event}
            onReplyPosted={() => setShowReplyBox(false)}
            onCancel={() => setShowReplyBox(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
