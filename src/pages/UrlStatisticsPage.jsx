import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, CircularProgress, Alert, Link, List, ListItem, ListItemText } from '@mui/material';
import { fetchUrlStatistics } from '../services/urlApiService';
import { Log } from '../services/logger';

function UrlStatisticsPage() {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Log("frontend", "info", "page", "Loading URL Statistics Page.");
    const getStats = async () => {
      try {
        const stats = await fetchUrlStatistics();
        setStatistics(stats);
      } catch (err) {
        setError('Failed to fetch statistics. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (statistics.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" align="center">
            No shortened URLs to display.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Statistics
        </Typography>
        <Grid container spacing={4}>
          {statistics.map((stat, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6">
                  Shortened URL: <Link href={stat.shortenedUrl} target="_blank" rel="noopener noreferrer">{stat.shortenedUrl}</Link>
                </Typography>
                <Typography variant="body1">Original URL: {stat.originalUrl}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(stat.creationDate).toLocaleString()} | Expires: {new Date(stat.expiryDate).toLocaleString()}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Total Clicks: {stat.totalClicks}</Typography>
                  {stat.totalClicks > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2">Detailed Clicks:</Typography>
                      <List dense>
                        {stat.detailedClicks.map((click, clickIndex) => (
                          <ListItem key={clickIndex}>
                            <ListItemText
                              primary={`Timestamp: ${new Date(click.timestamp).toLocaleString()}`}
                              secondary={`Source: ${click.source} | Location: ${click.location}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default UrlStatisticsPage;