import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Product, CartItem } from "../types";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function CartSheet({ 
  isOpen, 
  onClose, 
  items, 
  products, 
  onUpdateQuantity, 
  onRemove,
  onCheckout
}: CartSheetProps) {
  const cartProducts = items.map(item => ({
    ...products.find(p => p.id === item.productId)!,
    quantity: item.quantity
  })).filter(p => !!p.id);

  const subtotal = cartProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-card border-none rounded-none p-10">
        <SheetHeader>
          <SheetTitle className="text-sm uppercase tracking-[0.4em] font-bold">
            Shopping Bag
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 mt-10 overflow-y-auto pr-2 custom-scrollbar">
          {cartProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
              <p className="text-[10px] uppercase tracking-widest">Your bag is empty</p>
              <Button variant="link" onClick={onClose} className="text-foreground font-bold mt-2">SHOP COLLECTION</Button>
            </div>
          ) : (
            <div className="space-y-8">
              {cartProducts.map((product) => (
                <div key={product.id} className="flex gap-4 group">
                  <div className="h-16 w-16 bg-muted overflow-hidden flex-shrink-0 grayscale">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest line-clamp-1">{product.name}</h4>
                      <p className="text-[10px] text-muted-foreground tracking-widest font-sans mt-1">${product.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-white/10 px-1 scale-90 origin-left">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-none hover:bg-white hover:text-black"
                          onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
                        >
                          <Minus className="h-2 w-2" />
                        </Button>
                        <span className="w-6 text-center text-[10px] font-bold">{product.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-none hover:bg-white hover:text-black"
                          onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                        >
                          <Plus className="h-2 w-2" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRemove(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="mt-auto border-t border-white/10 pt-10 flex flex-col space-y-4 sm:flex-col">
          <div className="w-full space-y-3">
            <div className="flex justify-between text-[11px] uppercase tracking-widest">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-widest">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-bold">Complimentary</span>
            </div>
          </div>
          <Button 
            className="w-full h-14 rounded-none bg-transparent border border-white text-white hover:bg-white hover:text-black uppercase text-[11px] tracking-[0.2em] font-bold transition-all mt-6" 
            disabled={cartProducts.length === 0}
            onClick={onCheckout}
          >
            Proceed to Payment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
