import { useSeoMeta } from '@unhead/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
              のすとら胴上げ部は、新規日本人ユーザを継続的に胴上げし、Nostrに定住してもらうことを目的としたレコメンドクライアントです。

              <br/>
              kind30078のイベントとして新規日本人ユーザを取得し、そのタイムラインを表示する中央集権的なサービスです。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opt-out (工事中)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              このボタンを押すと、胴上げ対象リストから自分を外せるようになる予定です。
            </p>
            <Button variant="outline" disabled>
              胴上げ対象から自分を外す（工事中）
            </Button>
            <p className="text-xs">
              ※現在開発中
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Creator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <Link
                to="/profile/npub1svne455wa3rctcsnnhzjn2t9pldmgfpkd4rytewzsf8he02fysxsvgwhj4"
                className="text-blue-600 hover:text-blue-800 transition-colors break-all"
              >
                npub1svne455wa3rctcsnnhzjn2t9pldmgfpkd4rytewzsf8he02fysxsvgwhj4
              </Link>
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
            <p className="text-sm text-muted-foreground">
              イラスト素材:{' '}
              <a
                href="https://www.irasutoya.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                いらすとや
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
