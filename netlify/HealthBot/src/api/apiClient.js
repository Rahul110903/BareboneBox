export const apiClient = async ({ method, url, data }) => {
  try {
    const apiKey =
      "EAAVZBacNJqiwBQONFLj8OkmNJZA3o2B9JaTZCnGPd3GoBt38WLh2ecqFGvnnQm2NTZArAeTe87Idfjjs2ydJ2NI4RPDHju2E8wBHiGV7ZBkoqJRVrvTvHYQmSkZAIkyrUZB1puorFyaYU2BhZAqrb9k4zJ4fB2sZBnaweiGPbmxhLVbZALKICmIr0VeZAEWDyamsQZDZD";

    if (!apiKey) {
      throw new Error("WHATSAPP_API_KEY environment variable is not set");
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return {
      data: await response.json(),
      status: response.status,
    };
  } catch (error) {
    console.error("API Client Error:", error);
    throw error;
  }
};
