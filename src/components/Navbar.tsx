import { useAuth } from "../hooks/useAuth";
import { signInWithGoogle, logOut } from "../lib/firebase";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onCategoryChange?: (category: string) => void;
}

export function Navbar({ cartCount, onCartClick, onCategoryChange }: NavbarProps) {
  const { user, profile } = useAuth();

  const scrollToSection = (id: string, category?: string) => {
    if (category && onCategoryChange) onCategoryChange(category);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-[0.4em] uppercase">LUMINA</span>
          </div>

          <div className="hidden md:flex gap-8">
            <button onClick={() => scrollToSection('catalog')} className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors font-sans">Collection</button>
            <button onClick={() => scrollToSection('catalog', 'all')} className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors font-sans">New Arrivals</button>
            <button onClick={() => scrollToSection('catalog', 'Fashion')} className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors font-sans">Men</button>
            <button onClick={() => scrollToSection('catalog', 'Fashion')} className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors font-sans">Women</button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div style={{ position: 'relative' }} className="cursor-pointer" onClick={onCartClick}>
             <span className="text-xl">🛒</span>
             {cartCount > 0 && (
               <span className="absolute -top-1 -right-2 bg-foreground text-background text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[1.2rem]">
                 {cartCount}
               </span>
             )}
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-muted-foreground uppercase tracking-widest hidden sm:inline-block font-sans">Welcome, {user.displayName?.split(' ')[0]}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-none border border-white/20 p-1">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ""} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-white/10 rounded-none">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-widest font-sans">{user.displayName}</p>
                      <p className="text-[10px] text-muted-foreground font-sans">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-[10px] uppercase tracking-widest py-3 font-sans">Orders</DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem className="text-[10px] uppercase tracking-widest py-3 text-accent transition-colors font-sans">Admin Panel</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={logOut} className="text-[10px] uppercase tracking-widest py-3 text-destructive font-sans">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              onClick={signInWithGoogle} 
              variant="outline" 
              className="rounded-none border-white text-[10px] uppercase tracking-[0.2em] h-10 px-6 hover:bg-white hover:text-black transition-all font-sans"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
