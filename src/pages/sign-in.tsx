import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SignInView } from 'src/sections/auth';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Sign in - ${CONFIG.appName}`}</title>
      </Helmet>

   
        <SignInView />
    </>
  );
}
