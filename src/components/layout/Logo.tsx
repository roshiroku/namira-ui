import { FC } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { Row } from '../common/Flex';
import LogoIcon from './LogoIcon';

const Logo: FC<{
  size?: number;
  color?: string;
  slotProps?: { typography?: TypographyProps; }
}> = ({ size = 32, color = 'currentcolor', slotProps }) => {
  const { sx, ...typography }: TypographyProps = { ...slotProps?.typography, variant: 'h6' };
  return (
    <Row sx={{ display: 'inline-flex', alignItems: 'flex-end', letterSpacing: -1.5 }}>
      <LogoIcon width={size} fill={color} style={{ flexShrink: 0 }} />
      <Typography
        {...typography}
        sx={{
          lineHeight: 1,
          fontWeight: 400,
          fontSize: size / 1.5,
          mb: -0.25, ...sx
        }}
      >
        AMIRA
      </Typography>
    </Row>
  );
};

export default Logo;
