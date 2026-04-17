import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Product } from "../types";
import { Button } from "./ui/button";
import { Star, ArrowLeft } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { getProductRecommendations } from "../lib/recommendations";
import { ProductCard } from "./ProductCard";

// Actually I meant Modal/Dialog. Let's install dialog if not already. 
// I already installed dialog. 

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (id: string) => void;
  allProducts: Product[];
}

export function ProductDetail({ product, isOpen, onClose, onAddToCart, allProducts }: ProductDetailProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    if (product && isOpen) {
      getProductRecommendations(product, [], allProducts).then(setRecommendations);
    }
  }, [product, isOpen, allProducts]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col sm:flex-row border border-white/10 bg-card rounded-none shadow-2xl">
        <div className="w-full sm:w-1/2 h-64 sm:h-auto bg-muted grayscale">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="w-full sm:w-1/2 flex flex-col h-full bg-card overflow-hidden">
          <ScrollArea className="flex-1 p-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold font-sans">Series 04 / {product.category}</span>
                <DialogTitle className="text-4xl font-light tracking-tighter leading-tight uppercase">{product.name}</DialogTitle>
                <div className="flex items-center gap-2">
                   <div className="flex text-accent text-[10px]">★★★★★</div>
                   <span className="text-[10px] text-muted-foreground tracking-widest font-sans">(128 REVIEWS)</span>
                </div>
              </div>

              <p className="text-3xl font-light tracking-widest font-sans text-muted-foreground">${product.price}</p>

              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold font-sans">About the product</h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">{product.description}</p>
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold font-sans">Customer Reviews</h4>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest font-sans">User {i}</span>
                        <div className="flex text-accent text-[8px]">★★★★★</div>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic font-sans leading-relaxed">"Exceptional quality, really happy with my purchase!"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  className="w-full h-14 rounded-none bg-foreground text-background hover:bg-foreground/90 font-bold uppercase tracking-[0.2em] text-[11px] font-sans" 
                  onClick={() => onAddToCart(product.id)}
                >
                  Add to Bag
                </Button>
                <p className="text-center text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-4 font-bold font-sans">Complimentary Express Shipping</p>
              </div>

              {recommendations.length > 0 && (
                <div className="pt-10 space-y-6 border-t border-white/5">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold font-sans">Similar items</h4>
                  <div className="grid grid-cols-2 gap-6">
                    {recommendations.map(p => (
                      <div key={p.id} className="cursor-pointer group" onClick={() => {/* handle navigate to p */}}>
                        <div className="aspect-square bg-muted grayscale overflow-hidden group-hover:grayscale-0 transition-all mb-3">
                          <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground tracking-widest mt-1">${p.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
