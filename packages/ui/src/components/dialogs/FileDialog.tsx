import { useState, useEffect, useRef, type ReactNode } from 'react';
import * as Select from '@radix-ui/react-select';
import { HardDrive, Folder, Image, FileText, Download, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BaseDialog } from './BaseDialog';

interface LocationOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

const DEFAULT_LOCATIONS: LocationOption[] = [
  { value: 'Desktop', label: 'Desktop', icon: <Folder size={14} /> },
  { value: 'Pictures', label: 'Pictures', icon: <Image size={14} /> },
  { value: 'Documents', label: 'Documents', icon: <FileText size={14} /> },
  { value: 'Downloads', label: 'Downloads', icon: <Download size={14} /> },
];

function defaultLocationForType(fileType?: string): string {
  switch (fileType) {
    case 'image': return 'Pictures';
    case 'text':
    case 'document': return 'Documents';
    default: return 'Desktop';
  }
}

export interface FileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filename: string, location: string) => void;
  defaultFilename?: string;
  defaultLocation?: string;
  title?: string;
  fileType?: 'image' | 'text' | 'document' | 'other';
  locations?: LocationOption[];
}

export const FileDialog = ({
  isOpen,
  onClose,
  onSave,
  defaultFilename = 'untitled.txt',
  defaultLocation,
  title = 'Save As',
  fileType,
  locations = DEFAULT_LOCATIONS,
}: FileDialogProps) => {
  const [filename, setFilename] = useState(defaultFilename);
  const [location, setLocation] = useState(defaultLocation ?? defaultLocationForType(fileType));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFilename(defaultFilename);
      setLocation(defaultLocation ?? defaultLocationForType(fileType));
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, defaultFilename, defaultLocation, fileType]);

  const handleSave = () => {
    if (filename.trim()) {
      onSave(filename.trim(), location);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const activeLocation = locations.find((l) => l.value === location);

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title={title} icon={<HardDrive size={16} />}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Where:</label>
          <Select.Root value={location} onValueChange={setLocation}>
            <Select.Trigger
              className={cn(
                'flex w-full items-center justify-between rounded-lg border border-border/50 bg-input px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-ring/50',
              )}
              aria-label="Save location"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                {activeLocation?.icon}
                <Select.Value />
              </span>
              <Select.Icon>
                <ChevronDown size={14} className="text-muted-foreground" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className={cn(
                  'z-[2100] overflow-hidden rounded-lg border border-border/50',
                  'bg-popover/95 backdrop-blur-xl shadow-lg',
                )}
                position="popper"
                sideOffset={4}
              >
                <Select.Viewport className="p-1">
                  {locations.map((loc) => (
                    <Select.Item
                      key={loc.value}
                      value={loc.value}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm',
                        'outline-none cursor-default select-none',
                        'text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                      )}
                    >
                      {loc.icon && (
                        <span className="text-muted-foreground">{loc.icon}</span>
                      )}
                      <Select.ItemText>{loc.label}</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto">
                        <Check size={14} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Save As:</label>
          <input
            ref={inputRef}
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.target.select()}
            className={cn(
              'w-full rounded-lg border border-border/50 bg-input px-3 py-2 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring/50',
            )}
            placeholder="Enter filename…"
            aria-label="Filename"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className={cn(
              'rounded-lg border border-border/50 px-4 py-1.5 text-xs font-medium text-foreground',
              'hover:bg-muted transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-ring/50',
            )}
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!filename.trim()}
            className={cn(
              'rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'disabled:opacity-40 disabled:pointer-events-none',
              'focus:outline-none focus:ring-2 focus:ring-ring/50',
            )}
            aria-label="Save file"
          >
            Save
          </button>
        </div>
      </div>
    </BaseDialog>
  );
};
