export const apiClient = async ({ method, url, data }) => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      data: await response.json(),
      status: response.status,
    };
  } catch (error) {
    throw error;
  }
};
