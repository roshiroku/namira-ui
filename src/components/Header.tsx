import { useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Divider, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const Header: React.FC = () => {
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  return (
    <Box sx={{ height: 72 }}>
      <AppBar color="inherit" elevation={0} sx={{ height: 'inherit' }}>
        <Toolbar sx={{ height: 'inherit' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NAMIR
          </Typography>
          <Button ref={saveButtonRef} variant="contained" onClick={() => setSaveMenuOpen(true)}>
            Save As
          </Button>
          <Menu
            anchorEl={saveButtonRef.current}
            open={saveMenuOpen}
            onClose={() => setSaveMenuOpen(false)}
          >
            <MenuItem onClick={() => setSaveMenuOpen(false)}>JPEG</MenuItem>
            <MenuItem onClick={() => setSaveMenuOpen(false)}>PNG</MenuItem>
            <MenuItem onClick={() => setSaveMenuOpen(false)}>SVG</MenuItem>
            <MenuItem onClick={() => setSaveMenuOpen(false)}>GIF</MenuItem>
          </Menu>
          <IconButton ref={settingsButtonRef} color="inherit" onClick={() => setSettingsMenuOpen(true)}>
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={settingsButtonRef.current}
            open={settingsMenuOpen}
            onClose={() => setSettingsMenuOpen(false)}
          >
            <MenuItem onClick={() => setSettingsMenuOpen(false)}>Zip Files</MenuItem>
            <MenuItem onClick={() => setSettingsMenuOpen(false)}>Prefix Filenames</MenuItem>
            <MenuItem onClick={() => setSettingsMenuOpen(false)}>Option 3</MenuItem>
            <MenuItem onClick={() => setSettingsMenuOpen(false)}>Option 4</MenuItem>
          </Menu>
        </Toolbar>
        <Divider />
      </AppBar>
    </Box>
  );
};

export default Header;
