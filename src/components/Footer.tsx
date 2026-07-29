import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, type LucideIcon } from "lucide-react";

const PinterestIcon: LucideIcon = ((props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.79-.167-2.005.035-2.868.182-.78 1.174-4.97 1.174-4.97s-.3-.6-.3-1.487c0-1.394.808-2.435 1.814-2.435.855 0 1.268.642 1.268 1.412 0 .86-.548 2.145-.83 3.337-.236.998.5 1.812 1.485 1.812 1.782 0 3.152-1.879 3.152-4.59 0-2.4-1.725-4.078-4.188-4.078-2.853 0-4.528 2.14-4.528 4.352 0 .862.332 1.786.746 2.288a.3.3 0 0 1 .07.288c-.076.317-.246.998-.28 1.137-.043.183-.145.222-.335.134-1.25-.582-2.03-2.41-2.03-3.878 0-3.157 2.294-6.056 6.614-6.056 3.472 0 6.17 2.474 6.17 5.78 0 3.45-2.175 6.226-5.195 6.226-1.014 0-1.968-.527-2.294-1.15l-.624 2.38c-.226.87-.836 1.96-1.244 2.625.937.29 1.933.446 2.964.446 5.523 0 10-4.477 10-10S17.523 2 12 2Z" />
  </svg>
)) as unknown as LucideIcon;

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/", Icon: Instagram, color: "hover:text-[#E1306C]" },
  { label: "Pinterest", href: "https://www.pinterest.com/", Icon: PinterestIcon, color: "hover:text-[#E60023]" },
  { label: "Facebook", href: "https://www.facebook.com/", Icon: Facebook, color: "hover:text-[#1877F2]" },
  { label: "Twitter", href: "https://twitter.com/", Icon: Twitter, color: "hover:text-[#1DA1F2]" },
];

const Footer = () => (
  <footer id="contact" className="bg-primary text-primary-foreground">
    <div className="h-1 w-full bg-gradient-to-r from-sage via-olive to-sage" />
    <div className="container mx-auto px-6 py-16 lg:px-12">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="mb-4 font-heading text-2xl font-bold text-primary-foreground">GreenAura</h3>
          <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            Premium indoor plants, sustainably sourced and delivered with care. Transforming spaces into living sanctuaries since 2020.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-sage">Quick Links</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li><Link to="/" className="transition-colors hover:text-sage">Home</Link></li>
            <li><Link to="/shop" className="transition-colors hover:text-sage">Shop</Link></li>
            <li><Link to="/#story" className="transition-colors hover:text-sage">Our Story</Link></li>
            <li><Link to="/#contact" className="transition-colors hover:text-sage">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-sage">Follow Us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            {socials.map(({ label, href, Icon, color }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GreenAura on ${label}`}
                  className={`inline-flex items-center gap-2 transition-colors ${color}`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-primary-foreground/15 pt-8 text-center text-sm text-primary-foreground/60">
        © {new Date().getFullYear()} GreenAura. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
