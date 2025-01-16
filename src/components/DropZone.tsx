import { forwardRef, useCallback, ChangeEvent, useMemo } from 'react';
import { Box, Typography, Button, BoxProps, useTheme, SvgIcon } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import useDropZone from '../hooks/useDropZone';
import { Column } from './common/Flex';

export interface DropZoneProps extends BoxProps {
  label?: string;
  accept?: string; // Acceptable file types, e.g., 'image/*', 'application/pdf', etc.
  onDrop?: DragEventSource['onDrop'];
  onDragEnter?: DragEventSource['onDragEnter'];
  onDragLeave?: DragEventSource['onDragLeave'];
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => any;
}

const DropZone = forwardRef<typeof Box, DropZoneProps>(({
  label: _label,
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

  const label = useMemo(() => (
    _label || ('Drag and drop files here' + (onChange ? ', or click to select files' : ''))
  ), [_label, onChange]);

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
      <SvgIcon fontSize="large" color={isDragging ? 'primary' : 'action'} sx={{ fontSize: '6rem' }}>
        <UploadFileIcon />
      </SvgIcon>
      <Typography variant="body1" sx={{ mt: 1 }}>{label}</Typography>
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
