import React from 'react';
import { Card, CardContent, Typography, Avatar, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

// Styled components
const ProfileCard = styled(Card)(({ theme }) => ({
  width: '320px',
  margin: '20px auto',
  borderRadius: '16px',
  boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ProfileCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',
});

const UserName = styled(Typography)({
  fontWeight: 600,
  fontSize: '1.6rem',
  marginTop: '12px',
  color: '#333',
});

const UserDescription = styled(Typography)({
  fontSize: '1rem',
  color: '#777',
  marginTop: '8px',
  marginBottom: '16px',
  textAlign: 'center',
});

const UserInfo = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '16px',
  gap: '12px',
});

const InfoBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const SocialButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  margin: '4px',
  borderRadius: '8px',
  padding: '6px 16px',
  fontSize: '0.875rem',
  textTransform: 'capitalize',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
}));

// Component
const Profile = () => (
  <ProfileCard>
    <ProfileCardContent>
      <Avatar
        alt="John Doe"
        src="https://i.pravatar.cc/150?img=3"
        sx={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
      <UserName>John Doe</UserName>
      <UserDescription>
        Passionate software developer building innovative applications.
      </UserDescription>

      <UserInfo>
        <InfoBox>
          <Typography variant="subtitle2" color="textSecondary">
            Email
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            john.doe@example.com
          </Typography>
        </InfoBox>
        <InfoBox>
          <Typography variant="subtitle2" color="textSecondary">
            Location
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            New York, USA
          </Typography>
        </InfoBox>
      </UserInfo>

      <Box>
        <SocialButton
          variant="contained"
          startIcon={<i className="fab fa-facebook-f" />}
        >
          Facebook
        </SocialButton>
        <SocialButton
          variant="contained"
          startIcon={<i className="fab fa-twitter" />}
        >
          Twitter
        </SocialButton>
      </Box>
    </ProfileCardContent>
  </ProfileCard>
);

export default Profile;
