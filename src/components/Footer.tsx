const Footer = () => (
  <footer id="contact" className="border-t border-border py-16">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="mb-4 font-heading text-2xl font-bold text-foreground">GreenAura</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Premium indoor plants, sustainably sourced and delivered with care. Transforming spaces into living sanctuaries since 2020.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground">Quick Links</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><a href="#home" className="transition-colors hover:text-foreground">Home</a></li>
            <li><a href="#shop" className="transition-colors hover:text-foreground">Shop</a></li>
            <li><a href="#story" className="transition-colors hover:text-foreground">Our Story</a></li>
            <li><a href="#contact" className="transition-colors hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground">Follow Us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><a href="#" className="transition-colors hover:text-foreground">Instagram</a></li>
            <li><a href="#" className="transition-colors hover:text-foreground">Pinterest</a></li>
            <li><a href="#" className="transition-colors hover:text-foreground">Facebook</a></li>
            <li><a href="#" className="transition-colors hover:text-foreground">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GreenAura. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
