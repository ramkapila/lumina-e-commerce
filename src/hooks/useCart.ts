import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { Cart, CartItem } from "../types";
import { useAuth } from "./useAuth";

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Load from localStorage for guests
      const savedCart = localStorage.getItem("guest_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setLoading(false);
      return;
    }

    const cartRef = doc(db, "carts", user.uid);
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        setItems((snapshot.data() as Cart).items);
      } else {
        setItems([]);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `carts/${user.uid}`);
    });

    return unsubscribe;
  }, [user]);

  const updateCart = async (newItems: CartItem[]) => {
    setItems(newItems);
    if (user) {
      try {
        await setDoc(doc(db, "carts", user.uid), {
          userId: user.uid,
          items: newItems,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `carts/${user.uid}`);
      }
    } else {
      localStorage.setItem("guest_cart", JSON.stringify(newItems));
    }
  };

  const addToCart = (productId: string) => {
    const existing = items.find(i => i.productId === productId);
    if (existing) {
      updateCart(items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      updateCart([...items, { productId, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    updateCart(items.filter(i => i.productId === productId ? false : true));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    updateCart(items.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    updateCart([]);
  };

  return { items, loading, addToCart, removeFromCart, updateQuantity, clearCart };
}
