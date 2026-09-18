export async function searchFood(query: string) {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
      query
    )}&api_key=${import.meta.env.VITE_USDA_API_KEY}`
  );

  return response.json();
}