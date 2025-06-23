import { useSeoMeta } from '@unhead/react';
import { LoginArea } from '@/components/auth/LoginArea';
import { PostComposer } from '@/components/PostComposer';
import { Timeline } from '@/components/Timeline';

const Index = () => {

  useSeoMeta({
    title: 'Nostr TossUp',
    description: 'A decentralized social network built on Nostr protocol.',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold pl-3">Nostr TossUp</h1>
            <div className="flex items-center gap-2">
              <LoginArea className="max-w-60" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl px-4 py-6">
          <div className="space-y-6">
            <PostComposer />
            <Timeline />
          </div>
      </main>
    </div>
  );
};

export default Index;
