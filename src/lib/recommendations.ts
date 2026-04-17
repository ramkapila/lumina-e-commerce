import { Product } from "../types";

export async function getProductRecommendations(
  currentProduct: Product | null,
  cartItems: Product[],
  allProducts: Product[]
): Promise<Product[]> {
  if (allProducts.length === 0) return [];

  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentProduct, cartItems, allProducts })
    });
    return await response.json();
  } catch (error) {
    console.error('Recommendation error:', error);
    if (currentProduct) {
      return allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
    }
    return allProducts.slice(0, 4);
  }
}
