import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MultiRelaySelector } from "@/components/MultiRelaySelector";

interface RelaySettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RelaySettingsDialog({ isOpen, onClose }: RelaySettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Relay Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select which relays to use for searching and publishing posts.
          </p>
          <MultiRelaySelector className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}