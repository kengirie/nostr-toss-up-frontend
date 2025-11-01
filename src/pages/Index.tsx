import { useSeoMeta } from '@unhead/react';
import { NewUsersTimeline } from '@/components/NewUsersTimeline';
const Index = () => {

  useSeoMeta({
    title: 'のすとら胴上げ部',
    description: 'A decentralized social network built on Nostr protocol.',
  });

  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <NewUsersTimeline />
    </main>
  );
};

export default Index;
