import { useSeoMeta } from '@unhead/react';
import { LoginArea } from '@/components/auth/LoginArea';
import { PostComposer } from '@/components/PostComposer';
import { NewUsersTimeline } from '@/components/NewUsersTimeline';
import { RelaySettingsButton } from '@/components/RelaySettingsButton';
const Index = () => {

  useSeoMeta({
    title: 'のすとら胴上げ部',
    description: 'A decentralized social network built on Nostr protocol.',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pl-3">
              <img src="/douage.png" alt="のすとら胴上げ部" className="w-8 h-8" />
              <h1 className="text-xl font-bold">のすとら胴上げ部</h1>
            </div>
            <div className="flex items-center gap-2">
              <RelaySettingsButton />
              <LoginArea className="max-w-60" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl px-4 py-6">
          <div className="space-y-6">
            <PostComposer />

            <NewUsersTimeline />

          </div>
      </main>
    </div>
  );
};

export default Index;
