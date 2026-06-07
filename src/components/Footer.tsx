import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-20 bg-[var(--brand-surface)] pt-20 pb-10 px-6 md:px-12 lg:px-24 border-t border-[var(--brand-border)] transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 mb-16">
          {/* Chapter Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/logo_cis_uni_horizontal_white.svg"
                alt="IEEE CIS UNI Logo"
                width={200}
                height={50}
                className="h-10 md:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity logo-adaptive"
              />
            </Link>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-6">
            <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-brand-accent transition-all transform hover:scale-110">
              <FaInstagram size={22} />
            </a>
            <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-brand-accent transition-all transform hover:scale-110">
              <FaLinkedin size={22} />
            </a>
            <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-brand-accent transition-all transform hover:scale-110">
              <FaFacebook size={22} />
            </a>
          </div>

          {/* Institutional Logos */}
          <div className="flex items-center gap-8 md:gap-10">
            <Image
              src="/images/ieee_white_logo.png"
              alt="IEEE Logo"
              width={140}
              height={35}
              className="h-6 md:h-8 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity logo-adaptive"
            />
            <Image
              src="/images/logo_uni_white.png"
              alt="UNI Logo"
              width={120}
              height={40}
              className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity logo-adaptive"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[var(--brand-border)] text-center">
          <p className="text-[var(--brand-text-muted)] opacity-50 text-sm">
            © 2026 IEEE Computational Intelligence Society UNI. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
