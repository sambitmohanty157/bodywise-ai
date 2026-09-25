export async function searchFood(query: string) {
  const apiKey = import.meta.env.VITE_USDA_API_KEY;

  if (!apiKey) {
    throw new Error("USDA API key is missing.");
  }

  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
      query
    )}&api_key=${apiKey}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("USDA API ERROR:", {
      status: response.status,
      statusText: response.statusText,
      response: errorText,
    });

    throw new Error(
      `USDA API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}