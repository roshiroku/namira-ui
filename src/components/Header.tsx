import { FC, useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, Divider, Box, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ImageFormat } from '../enums/ImageFormat';
import { useImages } from '../providers/ImageProvider';
import SettingsMenu from './SettingsMenu';

const Header: FC = () => {
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const { setImages, saveImages } = useImages();

  return (
    <Box sx={{ height: 72 }}>
      <AppBar color="inherit" sx={{ height: 'inherit' }}>
        <Toolbar sx={{ height: 'inherit', gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NAMIRA
          </Typography>
          <Button ref={saveButtonRef} variant="contained" onClick={() => setSaveMenuOpen(true)}>
            Save As
          </Button>
          <Menu
            anchorEl={saveButtonRef.current}
            open={saveMenuOpen}
            onClose={() => setSaveMenuOpen(false)}
          >
            {Object.entries(ImageFormat).map(([label, value]) => (
              <MenuItem key={value} onClick={() => {
                setSaveMenuOpen(false);
                saveImages(value);
              }}>
                Save As {label}
              </MenuItem>
            ))}
          </Menu>
          <Button ref={clearButtonRef} variant="outlined" onClick={() => setImages([])}>
            Clear
          </Button>
          <Button ref={settingsButtonRef} color="inherit" onClick={() => setSettingsMenuOpen(true)} sx={{ minWidth: 0 }}>
            <SettingsIcon />
          </Button>
          <SettingsMenu open={settingsMenuOpen} onClose={() => setSettingsMenuOpen(false)} />
        </Toolbar>
        <Divider />
      </AppBar>
    </Box>
  );
};

export default Header;
