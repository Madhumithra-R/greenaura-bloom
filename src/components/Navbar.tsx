import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

const sectionLinks = [
  { label: "Home", href: "#home" },
  { label: "Story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();

  const isHome = location.pathname === "/";
  const solid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goSection = (href: string) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate("/" + href);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const goRoute = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  const linkClass = solid
    ? "text-muted-foreground hover:text-foreground"
    : "text-primary-foreground/70 hover:text-primary-foreground";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid ? "bg-background/90 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4 lg:px-12">
        <button
          onClick={() => goRoute("/")}
          className={`font-heading text-2xl font-bold tracking-tight transition-colors ${
            solid ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          GreenAura
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {sectionLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => goSection(link.href)}
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${linkClass}`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => goRoute("/shop")}
            className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${linkClass}`}
          >
            Shop
          </button>
          {user && (
            <button
              onClick={() => goRoute("/orders")}
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${linkClass}`}
            >
              Orders
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => goRoute("/admin")}
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${linkClass}`}
            >
              Admin
            </button>
          )}

          <button
            onClick={() => goRoute("/wishlist")}
            className={`relative transition-colors ${solid ? "text-foreground" : "text-primary-foreground"}`}
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => goRoute("/cart")}
            className={`relative transition-colors ${solid ? "text-foreground" : "text-primary-foreground"}`}
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <button
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:scale-105"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => goRoute("/auth")}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:scale-105"
            >
              <User size={14} /> Sign in
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`transition-colors md:hidden ${solid ? "text-foreground" : "text-primary-foreground"}`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 pb-6">
              {sectionLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => goSection(link.href)}
                  className="text-left text-lg font-medium text-foreground"
                >
                  {link.label}
                </button>
              ))}
              <button onClick={() => goRoute("/shop")} className="text-left text-lg font-medium text-foreground">Shop</button>
              <button onClick={() => goRoute("/wishlist")} className="text-left text-lg font-medium text-foreground">
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
              </button>
              <button onClick={() => goRoute("/cart")} className="text-left text-lg font-medium text-foreground">
                Cart{count > 0 ? ` (${count})` : ""}
              </button>
              {user && (
                <button onClick={() => goRoute("/orders")} className="text-left text-lg font-medium text-foreground">Orders</button>
              )}
              {isAdmin && (
                <button onClick={() => goRoute("/admin")} className="text-left text-lg font-medium text-foreground">Admin</button>
              )}
              <button
                onClick={async () => {
                  if (user) {
                    await signOut();
                    goRoute("/");
                  } else {
                    goRoute("/auth");
                  }
                }}
                className="mt-2 rounded-full bg-primary px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-primary-foreground"
              >
                {user ? "Sign out" : "Sign in"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
