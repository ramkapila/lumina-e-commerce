import React from "react";
import { Product } from "../types";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
  onViewDetails: (product: Product) => void;
  key?: React.Key;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full flex flex-col overflow-hidden border border-white/5 bg-card/50 rounded-none shadow-none group transition-all hover:bg-card">
        <div 
          className="aspect-[4/5] overflow-hidden cursor-pointer relative"
          onClick={() => onViewDetails(product)}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        </div>
        <CardHeader className="p-6 pb-0 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold font-sans">Series 04</span>
            <span className="font-light text-sm tracking-widest font-sans">${product.price}</span>
          </div>
          <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] line-clamp-1 cursor-pointer" onClick={() => onViewDetails(product)}>
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-6 mt-auto flex flex-col gap-4">
           {/* Tags pill style from design */}
           <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-muted/30 text-[8px] uppercase tracking-widest text-muted-foreground font-bold font-sans">{product.category}</span>
           </div>
          <Button 
            className="w-full h-12 gap-2 rounded-none bg-transparent border border-white/20 hover:bg-white hover:text-black uppercase text-[10px] tracking-widest font-bold transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            onClick={() => onAddToCart(product.id)}
          >
            Add to Bag
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
