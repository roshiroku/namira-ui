import { FC, useState, useRef } from 'react';
import { AppBar, Toolbar, Button, Menu, Divider, Box, MenuItem } from '@mui/material';
import { Settings as SettingsIcon, ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import ImageType from '../../enums/ImageType';
import { useImages } from '../../providers/ImageProvider';
import Logo from './Logo';
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
          <Logo size={36} />
          <Box sx={{ flexGrow: 1 }} />
          <Button ref={saveButtonRef} variant="contained" onClick={() => setSaveMenuOpen(true)} endIcon={<ArrowDropDownIcon />}>
            Save As
          </Button>
          <Menu
            anchorEl={saveButtonRef.current}
            open={saveMenuOpen}
            onClose={() => setSaveMenuOpen(false)}
            slotProps={{
              paper: { sx: { minWidth: saveButtonRef.current?.offsetWidth || 0 } }
            }}
          >
            {Object.entries(ImageType).filter(([_, value]) => !!value).map(([label, value]) => (
              <MenuItem key={value} onClick={() => {
                setSaveMenuOpen(false);
                saveImages(value);
              }}>
                {label}
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
