import { ChangeEvent, FC } from 'react';
import { Dialog, DialogTitle, DialogContent, FormControlLabel, Checkbox, TextField, Switch, DialogProps, useTheme, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import { useSettings } from '../../providers/SettingsProvider';
import { Column, Row } from '../common/Flex';

const SettingsMenu: FC<DialogProps> = ({ open, onClose }) => {
  const { settings, setSettings } = useSettings();
  const theme = useTheme();

  const handleZipDownloadChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, zipDownload: ev.target.checked });
  };

  const handleAutoOptimizeChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const autoOptimize = ev.target.checked;
    setSettings({ ...settings, quality: autoOptimize ? -1 : 1 });
  };

  const handleQualityChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, quality: parseFloat(ev.target.value) });
  };

  const handleThemeChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, theme: ev.target.checked ? 'dark' : 'light' });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Column sx={{ gap: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.zipDownload}
                onChange={handleZipDownloadChange}
              />
            }
            label={
              <Tooltip title="Enable this to download converted images as a single ZIP file">
                <Row component="span" sx={{ alignItems: 'center', gap: 0.5 }}>
                  Download Zip
                  <InfoIcon fontSize="small" color="action" />
                </Row>
              </Tooltip>
            }
            labelPlacement="start"
            sx={{ justifyContent: 'space-between', ml: 0 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={settings.quality === -1}
                onChange={handleAutoOptimizeChange}
              />
            }
            label={
              <Tooltip title="Automatically detect the best quality to minimize file size">
                <Row component="span" sx={{ alignItems: 'center', gap: 0.5 }}>
                  Detect Quality
                  <InfoIcon fontSize="small" color="action" />
                </Row>
              </Tooltip>
            }
            labelPlacement="start"
            sx={{ justifyContent: 'space-between', ml: 0 }}
          />

          {settings.quality !== -1 && (
            <TextField
              label="Quality"
              type="number"
              value={settings.quality}
              onChange={handleQualityChange}
              slotProps={{ htmlInput: { step: 0.05, min: 0, max: 1 } }}
              fullWidth
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={theme.palette.mode === 'dark'}
                onChange={handleThemeChange}
              />
            }
            label="Dark Mode"
            labelPlacement="start"
            sx={{ justifyContent: 'space-between', ml: 0 }}
          />
        </Column>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsMenu;
