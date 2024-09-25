import { Box, CircularProgress, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { ApiProfilePost200Response } from '../api'; // Add this import
import { Configuration } from '../api/configuration';
import { DefaultApi } from '../api';
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
        const response = await apiClient.apiProfilePost({ email: email ?? '' }); // Use the API client to make the request
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
    <div>
      <h1>Profile Page</h1>
      <p>Email: {email}</p> {/* Display the email */}
      {profileData && (
        <div>
          <h2>Profile Data</h2>
          <pre>{JSON.stringify(profileData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Profile;