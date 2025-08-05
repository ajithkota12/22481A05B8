import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper, CircularProgress, Link, Alert } from '@mui/material';
import { Log } from '../services/logger';
import { shortenUrl } from '../services/urlApiService';

const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

function UrlShortenerPage() {
  const [longUrl, setLongUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [customShortcode, setCustomShortcode] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  
  const [errors, setErrors] = useState({
    longUrl: '',
    validity: '',
  });

  const validateInputs = () => {
    let isValid = true;
    let newErrors = { longUrl: '', validity: '' };

    if (!urlRegex.test(longUrl)) {
      newErrors.longUrl = 'Please enter a valid URL (e.g., https://example.com)';
      isValid = false;
    }
    
    if (validity && (!Number.isInteger(Number(validity)) || Number(validity) <= 0)) {
      newErrors.validity = 'Validity must be a positive integer in minutes.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleShorten = async () => {
    setLoading(true);
    setGlobalError('');
    setErrors({ longUrl: '', validity: '' });

    const isValid = validateInputs();

    if (!isValid) {
      Log("frontend", "error", "handler", "Client-side validation failed for URL shortening.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        longUrl,
        validity: validity ? Number(validity) : 30,
        customShortcode: customShortcode || null,
      };

      const apiResponse = await shortenUrl(
        payload.longUrl,
        payload.validity,
        payload.customShortcode
      );
      
      const newShortenedUrl = {
        originalUrl: longUrl,
        shortenedUrl: apiResponse.shortenedUrl,
        expiryDate: new Date(apiResponse.expiryDate).toLocaleString(),
      };

      setResults([...results, newShortenedUrl]);

      setLongUrl('');
      setValidity('');
      setCustomShortcode('');
      
    } catch (error) {
      console.error('Failed to shorten URL:', error);
      setGlobalError('Failed to shorten URL. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener
        </Typography>

        {globalError && <Alert severity="error" sx={{ mb: 2 }}>{globalError}</Alert>}

        <Grid container spacing={2} component={Paper} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Original Long URL"
              variant="outlined"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              error={!!errors.longUrl}
              helperText={errors.longUrl}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Validity Period (in minutes, optional)"
              variant="outlined"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              error={!!errors.validity}
              helperText={errors.validity}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              variant="outlined"
              value={customShortcode}
              onChange={(e) => setCustomShortcode(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleShorten}
              disabled={loading}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Shorten URL'}
            </Button>
          </Grid>
        </Grid>

        {results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Your Shortened URLs
            </Typography>
            {results.map((result, index) => (
              <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">
                  Original: <Link href={result.originalUrl} target="_blank" rel="noopener noreferrer">{result.originalUrl}</Link>
                </Typography>
                <Typography variant="subtitle1">
                  Shortened: <Link href={result.shortenedUrl} target="_blank" rel="noopener noreferrer">{result.shortenedUrl}</Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expires: {result.expiryDate}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default UrlShortenerPage;