import { useSeoMeta } from '@unhead/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  useSeoMeta({
    title: 'About - のすとら胴上げ部',
    description: 'Learn more about のすとら胴上げ部 - A decentralized social network built on Nostr protocol.',
  });

  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              のすとら胴上げ部は、新規日本人ユーザを継続的に胴上げしNostrに定住してもらうことを目的としたミニマムオレオレレコメンドクライアントです。
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vibed with{' '}
              <a
                href="https://soapbox.pub/mkstack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                MKStack
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
