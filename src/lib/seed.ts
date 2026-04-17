import { collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { SAMPLE_PRODUCTS } from "../constants";

export async function seedProducts() {
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    
    if (snapshot.empty) {
      console.log("Seeding initial products...");
      for (const product of SAMPLE_PRODUCTS) {
        await setDoc(doc(db, "products", product.id), {
          ...product,
          createdAt: serverTimestamp()
        });
      }
      console.log("Seeding complete.");
    }
  } catch (error) {
    // We log as warning because seeding is a background task that might fail due to lack of admin permissions
    console.warn("Product seeding skipped or failed:", error instanceof Error ? error.message : String(error));
  }
}
