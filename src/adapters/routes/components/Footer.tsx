import Link from "next/link";

export interface FooterProps {
  siteName?: string;
  year?: number;
  socialLinks?: Array<{ platform: string; url: string }>;
  navigationLinks?: Array<{ href: string; label: string }>;
}

export const Footer: React.FC<FooterProps> = ({
  siteName = "Portfolio",
  year = new Date().getFullYear(),
  socialLinks = [],
  navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ],
}) => {
  return (
    <footer className="bg-background text-[#0A0A0A] mt-24 md:mt-40 border-t border-border">
      <div className="container-max py-16 md:py-24">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-6">
            <h3 className="font-serif font-bold text-3xl mb-6 tracking-tighter">{siteName}</h3>
            <p className="text-muted max-w-md text-sm leading-relaxed uppercase tracking-widest">
              Creating elegant digital solutions through thoughtful design and
              clean code.
            </p>
          </div>

          {/* Navigation Links */}
          {navigationLinks && navigationLinks.length > 0 && (
            <nav aria-label="Footer navigation" className="md:col-span-3">
              <h4 className="font-semibold mb-6 uppercase tracking-widest text-xs text-muted">Navigate</h4>
              <ul className="space-y-4">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="nav-link font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="md:col-span-3">
              <h4 className="font-semibold mb-6 uppercase tracking-widest text-xs text-muted">Connect</h4>
              <ul className="space-y-4">
                {socialLinks.map((link) => (
                  <li key={`${link.platform}-${link.url}`}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link font-medium"
                      aria-label={`Visit our ${link.platform}`}
                      title={link.platform}
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          {/* Copyright */}
          <p className="text-xs text-muted uppercase tracking-widest mb-4 md:mb-0">
            © {year} {siteName}
          </p>

          {/* Made with */}
          <p className="text-xs text-muted uppercase tracking-widest">
            Made with intent.
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
