import { Check, ArrowRight, Search } from "lucide-react";
import type { FoodPost } from "@/data/mockData";

interface CartAddedOverlayProps {
  post: FoodPost;
  onContinue: () => void;
  onGoToCart: () => void;
}

const CartAddedOverlay = ({ post, onContinue, onGoToCart }: CartAddedOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in" onClick={onContinue} />
      <div className="relative w-full max-w-sm rounded-3xl bg-background p-6 flex flex-col items-center gap-4 animate-scale-in shadow-elevated">
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center animate-heart-bounce">
          <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground">Zum Warenkorb hinzugefügt! ✔</h3>
          <p className="text-sm text-muted-foreground mt-1">{post.dish}</p>
          <p className="text-xs text-muted-foreground">{post.restaurant} · {post.price.toFixed(2).replace(".", ",")} €</p>
        </div>

        <img src={post.image} alt={post.dish} className="w-full h-32 rounded-2xl object-cover" />

        <div className="flex gap-3 w-full">
          <button
            onClick={onContinue}
            className="flex-1 py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-semibold flex items-center justify-center gap-2 transition-all hover:bg-secondary/80 active:scale-[0.97]"
          >
            <Search className="w-4 h-4" />
            Weiter suchen
          </button>
          <button
            onClick={onGoToCart}
            className="flex-1 py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-elevated active:scale-[0.97]"
          >
            Warenkorb
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartAddedOverlay;
