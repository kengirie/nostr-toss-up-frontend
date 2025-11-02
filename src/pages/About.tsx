import { useSeoMeta } from '@unhead/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

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
              <img src="/douage.png" alt="のすとら胴上げ部" className="w-8 h-8" />
              のすとら胴上げ部について
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              のすとら胴上げ部は、Nostrプロトコル上に構築された分散型ソーシャルネットワークです。
            </p>
            <p className="text-muted-foreground">
              中央集権的なサーバーに依存することなく、ユーザー同士が直接つながることができます。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nostrプロトコルについて</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Nostrは「Notes and Other Stuff Transmitted by Relays」の略で、
              分散型でオープンソースのプロトコルです。
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>検閲耐性：中央集権的な管理者がいないため、検閲されにくい</li>
              <li>ポータビリティ：データはユーザーが所有し、別のクライアントに移行可能</li>
              <li>オープン性：誰でもクライアントやリレーを作成可能</li>
              <li>シンプル性：軽量で理解しやすいプロトコル設計</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>技術仕様</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">フロントエンド</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>React 18.x</li>
                  <li>TypeScript</li>
                  <li>Vite</li>
                  <li>TailwindCSS</li>
                  <li>shadcn/ui</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Nostr関連</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Nostrify</li>
                  <li>nostr-tools</li>
                  <li>WebSocket接続</li>
                  <li>NIP対応</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>リンク</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://nostr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Nostr公式サイト
            </a>
            <a
              href="https://github.com/nostr-protocol/nips"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              NIPs (Nostr Implementation Possibilities)
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>クレジット</CardTitle>
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