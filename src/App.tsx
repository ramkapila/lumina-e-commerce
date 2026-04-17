import React, { useState, useEffect, useMemo, Component } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartSheet } from './components/CartSheet';
import { ProductDetail } from './components/ProductDetail';
import { useCart } from './hooks/useCart';
import { Product } from './types';
import { SAMPLE_PRODUCTS } from './constants';
import { collection, onSnapshot, query, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';

// Error Boundary as required
class ErrorBoundary extends Component<any, any> {
  public props: any;
  public state: any;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
    this.props = props;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center p-8 border border-white/10 shadow-lg bg-card">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest text-lg">System Error</h2>
            <p className="text-muted-foreground mb-6 text-xs uppercase tracking-widest">The application encountered an unexpected error.</p>
            <Button onClick={() => window.location.reload()} className="rounded-none font-bold uppercase tracking-widest text-[10px] bg-foreground text-background">Reload System</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { items: cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

  // Listen for products in Firestore (if any are added later)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const fsProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      if (fsProducts.length > 0) {
        setProducts(fsProducts);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "products");
    });
    return unsub;
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleAddToCart = (id: string) => {
    addToCart(id);
    toast.success("Added to cart", {
      description: "Item has been added to your shopping cart."
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground">
        <Navbar 
          cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} 
          onCartClick={() => setIsCartOpen(true)}
          onCategoryChange={setActiveCategory}
        />

        <main className="container mx-auto">
          {/* Hero Section - Elegant Dark Showcase */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border mb-px border-b border-white/10 overflow-hidden">
            <div className="bg-card p-12 lg:p-20 flex flex-col justify-center relative overflow-hidden h-[600px]">
               {/* Visual Frame Background Effect */}
              <div className="absolute right-[-10%] top-[10%] w-[500px] h-[500px] bg-white opacity-[0.02] rounded-full -z-0 blur-3xl" />
              
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 space-y-8"
              >
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Limited Edition / Series 04</span>
                  <h1 className="text-7xl font-light tracking-tighter leading-[1.05] uppercase">
                    Aura <br />Chronograph
                  </h1>
                  <p className="text-2xl font-light text-muted-foreground font-sans">$1,850.00</p>
                </div>
                
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed font-sans">
                  Engineered with a ceramic casing and sapphire crystal, the Aura Chronograph is a testament to minimalist performance. Water resistant to 100 meters.
                </p>
                
                <div className="pt-4">
                  <Button 
                    className="h-14 px-12 rounded-none bg-foreground text-background hover:bg-foreground/90 font-bold uppercase tracking-[0.2em] text-[11px]"
                    onClick={() => handleAddToCart('p2')}
                  >
                    Add to Bag
                  </Button>
                </div>

                <div className="pt-12">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2 font-bold font-sans">Verified Reviews</span>
                  <div className="flex items-center gap-3">
                    <div className="flex text-accent text-xs">★★★★★</div>
                    <span className="text-[11px] text-muted-foreground tracking-widest font-sans">(128 REVIEWS)</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-muted overflow-hidden relative group">
              <img 
                src="https://picsum.photos/seed/watch/1200/1200" 
                className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
                alt="Feature Product"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          </section>

          {/* Filtering Tabs / Collection Header */}
          <div id="catalog" className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 px-8 py-10 bg-background/50 backdrop-blur sticky top-16 z-40">
            <h2 className="text-[10px] uppercase tracking-[0.6em] font-bold">The Collection</h2>
            <Tabs defaultValue="all" onValueChange={setActiveCategory} className="w-auto mt-6 md:mt-0">
              <TabsList className="bg-transparent gap-10">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="bg-transparent rounded-none border-b-2 border-transparent px-0 pb-2 data-[state=active]:border-accent data-[state=active]:bg-transparent shadow-none uppercase text-[9px] tracking-[0.3em] font-bold transition-all data-[state=active]:text-accent text-muted-foreground hover:text-foreground"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Product Catalog Grid */}
          <section id="catalog-grid" className="px-8 py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onViewDetails={(p) => setSelectedProduct(p)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        </main>

        <footer className="bg-card border-t border-white/10 py-20">
          <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold block mb-8">Explore</span>
              <ul className="space-y-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-sans">
                <li><a href="#" className="hover:text-foreground transition-colors">Catalog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Men</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Women</a></li>
              </ul>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold block mb-8">Service</span>
              <ul className="space-y-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-sans">
                <li><a href="#" className="hover:text-foreground transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold block mb-8">Order History</span>
              <div className="text-[11px] text-muted-foreground mb-4 uppercase tracking-widest font-sans">Order #8291 — Delivered Dec 12</div>
              <a href="#" className="text-[11px] text-foreground font-bold hover:underline tracking-widest uppercase font-sans">Track Package →</a>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold block mb-8">Personalized Tags</span>
              <div className="flex flex-wrap gap-2">
                {['Minimalist', 'Leather', 'Gifts', 'Series 01', 'Eco'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-muted text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-bold hover:bg-muted/80 transition-colors cursor-default font-sans">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="container mx-auto px-8 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
             <span className="text-[20px] font-bold tracking-[0.4em] uppercase">LUMINA</span>
             <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans">© 2026 LUMINA PREMIUM. All rights reserved.</p>
          </div>
        </footer>

        <CartSheet 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems}
          products={products}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={() => {
            toast.info("Checkout", { description: "Checkout functionality would integrate Stripe/PayPal here." });
          }}
        />

        <ProductDetail 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          allProducts={products}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />

        <Toaster position="bottom-right" />
      </div>
    </ErrorBoundary>
  );
}
