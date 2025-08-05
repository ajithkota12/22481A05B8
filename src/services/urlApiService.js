import { Log } from './logger';

// You must replace these with the correct URLs from your documentation.
const SHORTEN_URL_API_ENDPOINT = "http://20.244.56.144/evaluation-service/shorten";
const STATISTICS_API_ENDPOINT = "http://20.244.56.144/evaluation-service/stats";
const REDIRECT_API_ENDPOINT = "http://20.244.56.144/evaluation-service/redirect";

// You must replace this with your actual access token.
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhaml0aGt1bWFya290YTEyQGdtYWlsLmNvbSIsImV4cCI6MTc1NDM3NTcyNiwiaWF0IjoxNzU0Mzc0ODI2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzBjZTZmNzAtYWM0My00NmY4LWFlNWQtNDNmNDQxNTY2MmY5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWppdGgga3VtYXIiLCJzdWIiOiI4NTA3ODBhNC04ZTdlLTQ2NDUtOGI2Yy05ZWVlODU1ZTc2YjAifSwiZW1haWwiOiJhaml0aGt1bWFya290YTEyQGdtYWlsLmNvbSIsIm5hbWUiOiJhaml0aCBrdW1hciIsInJvbGxObyI6IjIyNDgxYTA1YjgiLCJhY2Nlc3NDb2RlIjoiSGJEcHBHIiwiY2xpZW50SUQiOiI4NTA3ODBhNC04ZTdlLTQ2NDUtOGI2Yy05ZWVlODU1ZTc2YjAiLCJjbGllbnRTZWNyZXQiOiJhWWR6VlhyTlBXblVQSmdlIn0.ZtUo3LRxRs-QsMNJ8ljOGg8nnqJQCVg2Uu2GVr_D9OU";

export async function shortenUrl(longUrl, validity, customShortcode) {
  Log("frontend", "info", "api", `Starting API call to shorten URL: ${longUrl}`);
  const payload = { longUrl, validity, customShortcode };

  try {
    const response = await fetch(SHORTEN_URL_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      Log("frontend", "info", "api", "Successfully shortened URL.");
      return data;
    } else {
      const errorData = await response.json();
      Log("frontend", "error", "api", `API call failed with status: ${response.status}`);
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    Log("frontend", "error", "api", `An error occurred during API call: ${error.message}`);
    throw error;
  }
}

export async function fetchUrlStatistics() {
  Log("frontend", "info", "api", "Starting API call to fetch URL statistics.");
  try {
    const response = await fetch(STATISTICS_API_ENDPOINT, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    });
    if (response.ok) {
      const data = await response.json();
      Log("frontend", "info", "api", "Successfully fetched URL statistics.");
      return data;
    } else {
      const errorData = await response.json();
      Log("frontend", "error", "api", `API call failed with status: ${response.status}`);
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    Log("frontend", "error", "api", `An error occurred during API call: ${error.message}`);
    throw error;
  }
}

export async function getOriginalUrl(shortcode) {
  Log("frontend", "info", "api", `Starting API call for redirection: ${shortcode}`);
  try {
    const response = await fetch(`${REDIRECT_API_ENDPOINT}/${shortcode}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (response.ok) {
      const data = await response.json();
      Log("frontend", "info", "api", "Successfully retrieved original URL for redirection.");
      return data;
    } else {
      Log("frontend", "error", "api", `Redirection API call failed with status: ${response.status}`);
      throw new Error(`API Error: ${response.status}`);
    }
  } catch (error) {
    Log("frontend", "error", "api", `An error occurred during redirection API call: ${error.message}`);
    throw error;
  }
}