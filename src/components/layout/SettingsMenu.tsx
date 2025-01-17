import { ChangeEvent, FC } from 'react';
import { Dialog, DialogTitle, DialogContent, Checkbox, TextField, Switch, DialogProps, useTheme, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import { useSettings } from '../../providers/SettingsProvider';
import { Column, Row } from '../common/Flex';

const labelStyle = { display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' };

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
          <Row sx={{ justifyContent: 'space-between', alignItems: 'center', mr: -1.333 }}>
            <label htmlFor="zipDownloadCheckbox" style={labelStyle}>
              Download Zip
              <Tooltip title="Enable this to download converted images as a single ZIP file">
                <InfoIcon fontSize="small" color="action" />
              </Tooltip>
            </label>
            <Checkbox
              id="zipDownloadCheckbox"
              checked={settings.zipDownload}
              onChange={handleZipDownloadChange}
            />
          </Row>

          <Row sx={{ justifyContent: 'space-between', alignItems: 'center', mr: -1.333 }}>
            <label htmlFor="autoOptimizeCheckbox" style={labelStyle}>
              Detect Quality
              <Tooltip title="Automatically detect the best quality to minimize file size (JPG, JPEG, or WEBP)">
                <InfoIcon fontSize="small" color="action" />
              </Tooltip>
            </label>
            <Checkbox
              id="autoOptimizeCheckbox"
              checked={settings.quality === -1}
              onChange={handleAutoOptimizeChange}
            />
          </Row>

          {settings.quality !== -1 && (
            <Row sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="qualityInput" style={labelStyle}>
                Quality
                <Tooltip title="Manually set the quality for image conversions (JPG, JPEG, or WEBP)">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </label>
              <TextField
                id="qualityInput"
                type="number"
                value={settings.quality}
                onChange={handleQualityChange}
                slotProps={{ htmlInput: { step: 0.05, min: 0, max: 1 } }}
                size="small"
                sx={{ width: 100 }}
              />
            </Row>
          )}

          <Row sx={{ justifyContent: 'space-between', alignItems: 'center', mr: -1.5 }}>
            <label htmlFor="darkModeSwitch" style={labelStyle}>
              Dark Mode
            </label>
            <Switch
              id="darkModeSwitch"
              checked={theme.palette.mode === 'dark'}
              onChange={handleThemeChange}
            />
          </Row>
        </Column>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsMenu;
