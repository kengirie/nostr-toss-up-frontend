import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginArea } from '@/components/auth/LoginArea';
import { RelaySettingsDialog } from '@/components/RelaySettingsDialog';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export function Header() {
  const [relaySettingsOpen, setRelaySettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-2xl px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onPointerMove={(e) => e.preventDefault()}
                    onPointerLeave={(e) => e.preventDefault()}
                    className="h-9 w-9 pl-0 pr-0"
                  >
                    <span className="sr-only">Menu</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    onPointerEnter={(e) => e.preventDefault()}
                    onPointerLeave={(e) => e.preventDefault()}
                    className="w-fit min-w-[7rem]"
                  >
                    <div className="grid gap-1.5 p-2.5">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/"
                          className={cn(
                            "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">Timeline</div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/users"
                          className={cn(
                            "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">New Users</div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => setRelaySettingsOpen(true)}
                          className={cn(
                            "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">Relays</div>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/about"
                          className={cn(
                            "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">About</div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <img src="/douage.png" alt="のすとら胴上げ部" className="w-8 h-8" />
              <h1 className="text-xl font-bold">のすとら胴上げ部</h1>
            </Link>
          </div>
          <LoginArea className="max-w-60" />
        </div>
      </div>

      <RelaySettingsDialog
        isOpen={relaySettingsOpen}
        onClose={() => setRelaySettingsOpen(false)}
      />
    </header>
  );
}
