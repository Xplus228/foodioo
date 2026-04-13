import FoodCard from "./FoodCard";
import type { FoodPost } from "@/data/mockData";
import { X } from "lucide-react";

interface PostDetailOverlayProps {
  post: FoodPost;
  isSaved: boolean;
  isLiked: boolean;
  onSave: (id: string) => void;
  onLike: (id: string) => void;
  onAddToCart: (post: FoodPost) => void;
  onComments: (post: FoodPost) => void;
  onClose: () => void;
}

const PostDetailOverlay = ({ post, isSaved, isLiked, onSave, onLike, onAddToCart, onComments, onClose }: PostDetailOverlayProps) => {
  return (
    <div className="fixed inset-0 z-[60] bg-foreground animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full glass flex items-center justify-center transition-all active:scale-90 hover:bg-primary-foreground/20"
      >
        <X className="w-5 h-5 text-primary-foreground" />
      </button>
      <FoodCard
        post={post}
        isSaved={isSaved}
        isLiked={isLiked}
        onSave={onSave}
        onLike={onLike}
        onAddToCart={onAddToCart}
        onComments={onComments}
      />
    </div>
  );
};

export default PostDetailOverlay;
