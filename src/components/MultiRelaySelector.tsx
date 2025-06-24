import { Check, ChevronsUpDown, Wifi, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";

interface MultiRelaySelectorProps {
  className?: string;
}

export function MultiRelaySelector(props: MultiRelaySelectorProps) {
  const { className } = props;
  const { config, updateConfig, presetRelays = [] } = useAppContext();
  
  const selectedRelays = config.selectedRelays || [];
  const setSelectedRelays = (relays: string[]) => {
    // Ensure yabu.me is always included
    const updatedRelays = relays.includes('wss://yabu.me') 
      ? relays 
      : ['wss://yabu.me', ...relays];
    updateConfig((current) => ({ ...current, selectedRelays: updatedRelays }));
  };

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Function to normalize relay URL by adding wss:// if no protocol is present
  const normalizeRelayUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;
    
    // Check if it already has a protocol
    if (trimmed.includes('://')) {
      return trimmed;
    }
    
    // Add wss:// prefix
    return `wss://${trimmed}`;
  };

  // Toggle relay selection (yabu.me cannot be removed)
  const toggleRelay = (relay: string) => {
    const normalizedRelay = normalizeRelayUrl(relay);
    if (selectedRelays.includes(normalizedRelay)) {
      // Prevent yabu.me from being removed
      if (normalizedRelay !== 'wss://yabu.me') {
        setSelectedRelays(selectedRelays.filter(r => r !== normalizedRelay));
      }
    } else {
      setSelectedRelays([...selectedRelays, normalizedRelay]);
    }
  };

  // Remove relay (yabu.me cannot be removed)
  const removeRelay = (relay: string) => {
    if (relay === 'wss://yabu.me') return; // Prevent yabu.me from being removed
    setSelectedRelays(selectedRelays.filter(r => r !== relay));
  };

  // Handle adding a custom relay
  const handleAddCustomRelay = (url: string) => {
    const normalizedRelay = normalizeRelayUrl(url);
    if (!selectedRelays.includes(normalizedRelay)) {
      setSelectedRelays([...selectedRelays, normalizedRelay]);
    }
    setInputValue("");
  };

  // Check if input value looks like a valid relay URL
  const isValidRelayInput = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    
    // Basic validation - should contain at least a domain-like structure
    const normalized = normalizeRelayUrl(trimmed);
    try {
      new URL(normalized);
      return true;
    } catch {
      return false;
    }
  };

  // Get relay name for display
  const getRelayName = (url: string) => {
    const preset = presetRelays.find(r => r.url === url);
    return preset ? preset.name : url.replace(/^wss?:\/\//, '');
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Selected relays display */}
      {selectedRelays.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedRelays.map((relay) => (
            <div
              key={relay}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
            >
              <Wifi className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{getRelayName(relay)}</span>
              {relay !== 'wss://yabu.me' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                  onClick={() => removeRelay(relay)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Relay selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add relay ({selectedRelays.length} selected)</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search relays or type URL..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue && isValidRelayInput(inputValue) ? (
                  <CommandItem
                    onSelect={() => handleAddCustomRelay(inputValue)}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">Add custom relay</span>
                      <span className="text-xs text-muted-foreground">
                        {normalizeRelayUrl(inputValue)}
                      </span>
                    </div>
                  </CommandItem>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {inputValue ? "Invalid relay URL" : "No relay found."}
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {presetRelays
                  .filter((option) => 
                    !inputValue || 
                    option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.url.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.url}
                      value={option.url}
                      onSelect={() => toggleRelay(option.url)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRelays.includes(option.url) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{option.name}</span>
                        <span className="text-xs text-muted-foreground">{option.url}</span>
                      </div>
                    </CommandItem>
                  ))}
                {inputValue && isValidRelayInput(inputValue) && (
                  <CommandItem
                    onSelect={() => handleAddCustomRelay(inputValue)}
                    className="cursor-pointer border-t"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">Add custom relay</span>
                      <span className="text-xs text-muted-foreground">
                        {normalizeRelayUrl(inputValue)}
                      </span>
                    </div>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}