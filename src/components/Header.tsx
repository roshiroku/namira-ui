import { FC, useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Divider, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import useImageConverter from '../hooks/useImageConverter';
import useDownload from '../hooks/useDownload';
import { useImages } from '../providers/ImageProvider';
import { ImageFormat } from '../enums/ImageFormat';

const Header: FC = () => {
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const { images, setImages } = useImages();

  const { convertImages, detectQuality } = useImageConverter();
  const { zip } = useDownload();

  const handleSaveAs = async (format: ImageFormat) => {
    if (images.length === 0) {
      alert("No images to convert.");
      return;
    }

    try {
      const convertedImages: ImageFile[] = [];

      for (const image of images) {
        console.log('finding min quality for image ' + image.name);
        const quality = await detectQuality(image, format);
        console.log('min quality set to ' + quality);
        const [convertedImage] = await convertImages([image], { format, quality });
        convertedImages.push(convertedImage);
      }

      console.log("Converted Images:", convertedImages);

      // Use the download hook to download images
      zip(convertedImages.map(({ name, src }) => ({ name, url: src })));
    } catch (error) {
      console.error("Error converting images:", error);
    }
  };

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
                handleSaveAs(value);
              }}>
                Save As {label}
              </MenuItem>
            ))}
          </Menu>
          <Button ref={clearButtonRef} variant="outlined" onClick={() => setImages([])}>
            Clear
          </Button>
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
