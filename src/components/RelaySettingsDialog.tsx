import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
          <DialogDescription>
            Select which relays to use for searching and publishing posts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <MultiRelaySelector className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}