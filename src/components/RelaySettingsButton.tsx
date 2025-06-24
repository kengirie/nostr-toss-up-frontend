import { useState } from 'react';
import { Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RelaySettingsDialog } from '@/components/RelaySettingsDialog';

interface RelaySettingsButtonProps {
  className?: string;
}

export function RelaySettingsButton({ className }: RelaySettingsButtonProps) {
  const [relaySettingsOpen, setRelaySettingsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setRelaySettingsOpen(true)}
        className={className}
      >
        <Wifi className="h-4 w-4" />
      </Button>

      <RelaySettingsDialog
        isOpen={relaySettingsOpen}
        onClose={() => setRelaySettingsOpen(false)}
      />
    </>
  );
}