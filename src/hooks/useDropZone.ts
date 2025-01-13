import { useCallback, useMemo, useRef, useState, DragEvent, useEffect } from 'react';

const useDropZone = ({ element: el, accept = '*', onDrop, onDragEnter, onDragLeave }: {
  element?: Window | HTMLElement;
  accept?: string;
} & DragEventSource = {}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const dragCounter = useRef(0);

  const acceptType = useMemo(() => accept.replace('/*', ''), [accept]);

  const hasFiles = useCallback((dt: DataTransfer | null): boolean => (
    Array.from(dt?.items || []).some((item) => accept === '*' || item.type.startsWith(acceptType))
  ), [accept, acceptType]);

  const filterFiles = useCallback((files: File[]): File[] => (
    files.filter((file) => accept === '*' || file.type.startsWith(acceptType))
  ), [accept, acceptType]);

  const handleDrop = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const files = filterFiles(Array.from(ev.dataTransfer?.files || []));
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    setFiles(files);
    if (onDrop) onDrop({ ...ev, dataTransfer });
  }, [onDrop, filterFiles]);

  const handleDragEnter = useCallback((ev: DragEvent) => {
    if (!dragCounter.current++ && hasFiles(ev.dataTransfer)) {
      setIsDragging(true);
      if (onDragEnter) onDragEnter(ev);
    }
  }, [onDragEnter, hasFiles]);

  const handleDragOver = useCallback((ev: DragEvent) => ev.preventDefault(), []);

  const handleDragLeave = useCallback((ev: DragEvent) => {
    if (!--dragCounter.current) {
      setIsDragging(false);
      if (onDragLeave) onDragLeave(ev);
    }
  }, [onDragLeave, isDragging]);

  useEffect(() => {
    if (el) {
      el.addEventListener('drop', handleDrop as any);
      el.addEventListener('dragenter', handleDragEnter as any);
      el.addEventListener('dragover', handleDragOver as any);
      el.addEventListener('dragleave', handleDragLeave as any);
      return () => {
        el.removeEventListener('drop', handleDrop as any);
        el.removeEventListener('dragenter', handleDragEnter as any);
        el.removeEventListener('dragover', handleDragOver as any);
        el.removeEventListener('dragleave', handleDragLeave as any);
      };
    }
  }, []);

  return {
    files,
    isDragging,
    hasFiles,
    filterFiles,
    handleDrop,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
  };
};

export default useDropZone;
