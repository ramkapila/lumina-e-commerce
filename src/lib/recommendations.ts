import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

export async function getProductRecommendations(
  currentProduct: Product | null,
  cartItems: Product[],
  allProducts: Product[]
): Promise<Product[]> {
  if (allProducts.length === 0) return [];

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  const context = {
    currentProduct: currentProduct ? { name: currentProduct.name, category: currentProduct.category } : null,
    cart: cartItems.map(item => ({ name: item.name, category: item.category })),
    catalog: allProducts.map(p => ({ id: p.id, name: p.name, category: p.category, description: p.description }))
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI e-commerce recommendation engine.
      Based on the following context, suggest exactly 4 relevant product IDs from the catalog.
      
      Context: ${JSON.stringify(context)}
      
      Return the result as a JSON array of strings containing the product IDs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const recommendedIds: string[] = JSON.parse(response.text || "[]");
    return allProducts.filter(p => recommendedIds.includes(p.id));
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    // Fallback: return products from the same category
    if (currentProduct) {
      return allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
    }
    return allProducts.slice(0, 4);
  }
}
