import { Link } from 'react-router-dom';
import { LoginArea } from '@/components/auth/LoginArea';
import { RelaySettingsButton } from '@/components/RelaySettingsButton';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-2xl px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/">
            <div className="flex items-center gap-2 pl-3 hover:opacity-80 transition-opacity cursor-pointer">
              <img src="/douage.png" alt="のすとら胴上げ部" className="w-8 h-8" />
              <h1 className="text-xl font-bold">のすとら胴上げ部</h1>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <RelaySettingsButton />
            <LoginArea className="max-w-60" />
          </div>
        </div>
      </div>
    </header>
  );
}