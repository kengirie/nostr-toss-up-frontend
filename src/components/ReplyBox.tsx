import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import type { NostrEvent } from '@nostrify/nostrify';

interface ReplyBoxProps {
  replyTo: NostrEvent;
  onReplyPosted?: () => void;
  onCancel?: () => void;
}

export function ReplyBox({ replyTo, onReplyPosted, onCancel }: ReplyBoxProps) {
  const [content, setContent] = useState('');
  const { user } = useCurrentUser();
  const { mutate: createEvent, isPending } = useNostrPublish();
  const author = useAuthor(user?.pubkey || '');

  if (!user) return null;

  const metadata = author.data?.metadata;
  const displayName = metadata?.name || genUserName(user.pubkey);
  const profileImage = metadata?.picture;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createEvent(
      {
        kind: 1,
        content: content.trim(),
        tags: [
          ['e', replyTo.id, '', 'reply'],
          ['p', replyTo.pubkey]
        ]
      },
      {
        onSuccess: () => {
          setContent('');
          onReplyPosted?.();
        },
      }
    );
  };

  return (
    <div className="border-t mt-4 pt-4">
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profileImage} alt={displayName} />
          <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Post your reply"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!content.trim() || isPending}
              >
                {isPending ? 'Replying...' : 'Reply'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}