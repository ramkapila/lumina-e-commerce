import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

app.post('/api/recommendations', async (req, res) => {
  const { currentProduct, cartItems, allProducts } = req.body;

  if (!allProducts || allProducts.length === 0) {
    return res.json([]);
  }

  const context = {
    currentProduct: currentProduct ? { name: currentProduct.name, category: currentProduct.category } : null,
    cart: cartItems.map((item: any) => ({ name: item.name, category: item.category })),
    catalog: allProducts.map((p: any) => ({ id: p.id, name: p.name, category: p.category, description: p.description }))
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an AI e-commerce recommendation engine.
      Based on the following context, suggest exactly 4 relevant product IDs from the catalog.
      Context: ${JSON.stringify(context)}
      Return the result as a JSON array of strings containing the product IDs.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });

    const recommendedIds: string[] = JSON.parse(response.text || '[]');
    const recommended = allProducts.filter((p: any) => recommendedIds.includes(p.id));
    res.json(recommended);
  } catch (error) {
    console.error('Gemini error:', error);
    const fallback = currentProduct
      ? allProducts.filter((p: any) => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4)
      : allProducts.slice(0, 4);
    res.json(fallback);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
