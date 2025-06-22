import { useSeoMeta } from '@unhead/react';
import { LoginArea } from '@/components/auth/LoginArea';
import { PostComposer } from '@/components/PostComposer';
import { Timeline } from '@/components/Timeline';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const Index = () => {
  const { user } = useCurrentUser();

  useSeoMeta({
    title: 'Nostr Social',
    description: 'A decentralized social network built on Nostr protocol.',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Nostr Social</h1>
            <LoginArea className="max-w-60" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl px-4 py-6">
        {user ? (
          <div className="space-y-6">
            <PostComposer />
            <Timeline />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Nostr Social</h2>
            <p className="text-muted-foreground mb-6">
              Connect to the decentralized social web. Log in to start posting and following others.
            </p>
            <div className="flex justify-center">
              <LoginArea className="max-w-xs" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
