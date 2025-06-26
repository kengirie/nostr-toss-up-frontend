import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLoggedInAccounts } from "@/hooks/useLoggedInAccounts";
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { Image, Smile } from 'lucide-react';

export function PostComposer() {
  const [content, setContent] = useState('');
  const { currentUser } = useLoggedInAccounts();

  const { mutate: createEvent, isPending } = useNostrPublish();
  const author = useAuthor(currentUser?.pubkey || '');

  if (!currentUser) return null;

  const metadata = author.data?.metadata;
  const displayName = metadata?.name || genUserName(currentUser.pubkey);
  const profileImage = metadata?.picture;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createEvent(
      { kind: 1, content: content.trim() },
      {
        onSuccess: () => {
          setContent('');
        },
      }
    );
  };

  const characterCount = content.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={profileImage} alt={displayName} />
            <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{displayName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-0 text-lg placeholder:text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
            maxLength={maxCharacters + 50}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Image className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Smile className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {characterCount}/{maxCharacters}
                </span>
                <div className="w-8 h-8 relative">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx={16}
                      cy={16}
                      r={14}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="text-muted-foreground/20"
                    />
                    <circle
                      cx={16}
                      cy={16}
                      r={14}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeDasharray={`${(characterCount / maxCharacters) * 87.96} 87.96`}
                      className={isOverLimit ? 'text-destructive' : 'text-primary'}
                    />
                  </svg>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!content.trim() || isPending || isOverLimit}
                className="rounded-full px-6"
              >
                {isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
