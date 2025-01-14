import { forwardRef, useCallback, ChangeEvent } from 'react';
import { Box, Typography, Button, BoxProps, useTheme } from '@mui/material';
import useDropZone from '../hooks/useDropZone';
import { Column } from './common/Flex';

export interface DropZoneProps extends BoxProps {
  accept?: string; // Acceptable file types, e.g., 'image/*', 'application/pdf', etc.
  onDrop?: DragEventSource['onDrop'];
  onDragEnter?: DragEventSource['onDragEnter'];
  onDragLeave?: DragEventSource['onDragLeave'];
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => any;
}

const DropZone = forwardRef<typeof Box, DropZoneProps>(({
  accept = '*',
  onDrop,
  onDragEnter,
  onDragLeave,
  onChange,
  sx,
  ...props
}, ref) => {
  const theme = useTheme();

  const {
    isDragging,
    filterFiles,
    handleDrop,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
  } = useDropZone({ accept, onDrop, onDragEnter, onDragLeave });

  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const files = filterFiles(Array.from(ev.target.files || []));
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    onChange({ ...ev, target: { ...ev.target, files: dt.files } });
  }, [onChange, filterFiles]);

  return (
    <Column
      ref={ref}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      sx={{
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 4,
        border: '2px dashed',
        borderColor: isDragging ? `primary.main` : `action.disabled`,
        backgroundColor: isDragging ? `primary.${theme.palette.mode}est` : 'background.default',
        transition: 'background-color 0.2s, border-color 0.2s',
        ...sx
      }}
      {...props}
    >
      <Typography variant="body1">
        Drag and drop files here
        {onChange ? ', or click to select files' : ''}
      </Typography>
      {onChange && (
        <label>
          <Button variant="outlined" component="span" color="primary">
            Choose Files
          </Button>
          <input
            type="file"
            accept={accept}
            multiple
            style={{ display: 'none' }}
            onChange={handleChange}
          />
        </label>
      )}
    </Column>
  );
});

export default DropZone;
