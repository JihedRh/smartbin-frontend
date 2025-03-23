import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { RouterLink } from 'src/routes/components';
import { stylesMode } from 'src/theme/styles';
import { Logo } from 'src/components/logo';
import { url } from 'inspector';

import { Main } from './main';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export type AuthLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function AuthLayout({ sx, children, header }: AuthLayoutProps) {
  const layoutQuery: Breakpoint = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: { maxWidth: false },
            toolbar: { sx: { bgcolor: 'transparent', backdropFilter: 'unset' } },
          }}
          sx={{
            position: { [layoutQuery]: 'fixed' },
            ...header?.sx,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: <Logo />,
            rightArea: (
              <Link
                component={RouterLink}
                href="#"
                color="inherit"
                sx={{ typography: 'subtitle2' }}
              >
                Need help?
              </Link>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={{
        position: 'relative',
        height: '100vh',
        '&::before': {
          width: '100%', 
          height: '100%', 
          zIndex: -1,
          content: "''",
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.3, 
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: `url(/assets/background/bin2.jpg)`,
          animation: 'zoomBackground 10s infinite', 
        },
        '@keyframes zoomBackground': {
          '0%': {
            backgroundSize: '120%', 
          },
          '50%': {
            backgroundSize: '100%', 

          },
          '100%': {
            backgroundSize: '120%', 
          },
        },
        [stylesMode.dark]: { opacity: 0.08 },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
