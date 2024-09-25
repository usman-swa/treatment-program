import { ApiProfilePost200Response, Configuration, DefaultApi } from '../api';
import { Avatar, Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import AppHeader from './AppHeader';
import { useLocation } from 'react-router-dom';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ApiProfilePost200Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = new Configuration({
          basePath: 'http://localhost:8000', // Set the base path for the API client
        });
        const apiClient = new DefaultApi(config);
        const requestBody = { email: email || '' }; // Ensure email is not null
        const response = await apiClient.apiProfilePost(requestBody); // Use the API client to make the request
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Error fetching profile data');
        setLoading(false);
      }
    };

    if (email) {
      fetchProfile();
    }
  }, [email]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <AppHeader />
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {profileData?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h5">{profileData?.name}</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {profileData?.email}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Profile;