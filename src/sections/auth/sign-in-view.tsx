import { useState, useCallback } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export function SignInView() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSignIn = useCallback(() => {
    setLoading(true);
    setErrorMessage('');

    axios
      .post('http://localhost:7001/api/login', { email, password })
      .then((response) => {
        const { full_name, eemail } = response.data;
        console.log('full_name:', full_name);
        console.log('eemail:', email);

        localStorage.setItem('full_name', full_name);
        localStorage.setItem('eemail', email);

        navigate('/home');
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setErrorMessage('Yekhi el email wala el password ghalta!');
        } else {
          setErrorMessage('Winek? El moshkila min el server!');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, password, navigate]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Icon icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        loading={loading}
      >
        Sign In
      </LoadingButton>
    </Box>
   
  );

  return (
    <>

      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign In</Typography>
        <Typography variant="body2" color="text.secondary">
        don&apos;t u have an account ?
        <Link
            variant="subtitle2"
            sx={{ ml: 0.5, cursor: 'pointer' }}
            onClick={() => navigate('/register')}
          >
            sign up
          </Link>
        </Typography>
      </Box>

      <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
        {renderForm}
      </form>

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          or sign in by 
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Icon icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Icon icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Icon icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
 
    </>
  );
}
