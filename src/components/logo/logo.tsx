import { forwardRef } from 'react';
import Box, { BoxProps } from '@mui/material/Box';  
import { useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';


// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { href = '/', isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    const singleLogo = (
      <Box
        alt="hne"
        component="img"
        src="/assets/icons/glass/Techolypse_logo.svg"
        sx={{
          width: '100%', 
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src="/assets/icons/glass/Techolypse_logo.svg"
        sx={{
          width: '100%',  
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    );

    return (
      <Box
        ref={ref}
        component={disableLink ? 'div' : RouterLink}
        href={href}
        className={className}
        aria-label="Logo"
        sx={{
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
