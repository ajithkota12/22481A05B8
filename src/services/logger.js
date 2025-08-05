const LOGS_API_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhaml0aGt1bWFya290YTEyQGdtYWlsLmNvbSIsImV4cCI6MTc1NDM3NTcyNiwiaWF0IjoxNzU0Mzc0ODI2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzBjZTZmNzAtYWM0My00NmY4LWFlNWQtNDNmNDQxNTY2MmY5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWppdGgga3VtYXIiLCJzdWIiOiI4NTA3ODBhNC04ZTdlLTQ2NDUtOGI2Yy05ZWVlODU1ZTc2YjAifSwiZW1haWwiOiJhaml0aGt1bWFya290YTEyQGdtYWlsLmNvbSIsIm5hbWUiOiJhaml0aCBrdW1hciIsInJvbGxObyI6IjIyNDgxYTA1YjgiLCJhY2Nlc3NDb2RlIjoiSGJEcHBHIiwiY2xpZW50SUQiOiI4NTA3ODBhNC04ZTdlLTQ2NDUtOGI2Yy05ZWVlODU1ZTc2YjAiLCJjbGllbnRTZWNyZXQiOiJhWWR6VlhyTlBXblVQSmdlIn0.ZtUo3LRxRs-QsMNJ8ljOGg8nnqJQCVg2Uu2GVr_D9OU";

export async function Log(stack, level, packageName, message) {
  const requestBody = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: packageName.toLowerCase(),
    message: message,
  };

  try {
    const response = await fetch(LOGS_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Failed to create log:", response.status);
    }
  } catch (error) {
    console.error("An error occurred during the log API call:", error);
  }
}