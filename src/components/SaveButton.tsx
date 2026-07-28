import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";

type Props = {
  productId: string;
  /** "icon" for a floating heart over imagery, "button" for a labelled control */
  variant?: "icon" | "button";
  className?: string;
};

const SaveButton = ({ productId, variant = "icon", className = "" }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isSaved, toggle } = useWishlist();
  const saved = user ? isSaved(productId) : false;

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/auth?next=/wishlist");
      return;
    }
    toggle.mutate(productId);
  };

  if (variant === "button") {
    return (
      <button
        onClick={handle}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={saved}
        className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
          saved
            ? "border-accent bg-accent/10 text-accent"
            : "border-border text-muted-foreground hover:text-foreground"
        } ${className}`}
      >
        <Heart size={14} className={saved ? "fill-current" : ""} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-transform hover:scale-110 ${
        saved ? "text-accent" : "text-muted-foreground"
      } ${className}`}
    >
      <Heart size={16} className={saved ? "fill-current" : ""} />
    </button>
  );
};

export default SaveButton;
