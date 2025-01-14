type ThemeMode = 'system' | 'light' | 'dark';

type Settings = { theme: ThemeMode; zipDownload: boolean; quality: number; };

type DragEventSource = {
  onDrop?: (ev: React.DragEvent) => any;
  onDragEnter?: (ev: React.DragEvent) => any;
  onDragLeave?: (ev: React.DragEvent) => any;
};

type ImageInput = File | ImageFile | string;

type ImageFile = { name: string; type: string; size: number; src: string; };
