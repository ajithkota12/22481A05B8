import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { getOriginalUrl } from '../services/urlApiService';
import { Log } from '../services/logger';

function RedirectPage() {
  const { shortcode } = useParams();
  const [error, setError] = useState('');

  useEffect(() => {
    Log("frontend", "info", "redirect", `Redirecting from shortcode: ${shortcode}`);
    const redirect = async () => {
      try {
        const { originalUrl } = await getOriginalUrl(shortcode);
        window.location.href = originalUrl;
      } catch (err) {
        setError("Invalid shortcode or URL not found.");
        Log("frontend", "error", "redirect", `Failed to redirect shortcode: ${shortcode}`);
      }
    };
    if (shortcode) {
      redirect();
    } else {
      setError("No shortcode provided.");
    }
  }, [shortcode]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      {error ? (
        <Typography variant="h6" color="error">{error}</Typography>
      ) : (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>Redirecting...</Typography>
        </>
      )}
    </Box>
  );
}

export default RedirectPage;