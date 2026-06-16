import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaFacebook, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-20 bg-[var(--brand-surface)] pt-20 pb-10 px-6 md:px-12 lg:px-24 border-t border-[var(--brand-border)] overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Col 1: Brand & Desc */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start gap-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo_cis_uni_horizontal_white.svg"
                alt="IEEE CIS UNI Logo"
                width={200}
                height={50}
                className="h-10 md:h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity logo-adaptive"
              />
            </Link>
            <p className="text-[var(--brand-text-muted)] text-sm md:text-base text-center md:text-left leading-relaxed max-w-sm">
              Impulsando el futuro de la inteligencia computacional en el Perú a través de la investigación, innovación y desarrollo de talentos.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-4 pt-2">
              <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text-muted)] hover:text-white hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-400 hover:border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <FaInstagram size={18} />
              </a>
              <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text-muted)] hover:text-white hover:bg-[#0A66C2] hover:border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <FaLinkedin size={18} />
              </a>
              <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text-muted)] hover:text-white hover:bg-[#1877F2] hover:border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <FaFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 flex flex-col items-center md:items-start lg:pl-10">
            <h3 className="text-[var(--brand-text)] font-semibold mb-6 text-lg tracking-wide">Explorar</h3>
            <ul className="flex flex-col gap-3 text-center md:text-left">
              {[
                { name: "Inicio", path: "/" },
                { name: "Nosotros", path: "/nosotros" },
                { name: "Proyectos", path: "/proyectos" },
                { name: "Eventos", path: "/eventos" },
                { name: "Miembros", path: "/miembros" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] transition-colors duration-300 flex items-center justify-center md:justify-start gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="lg:col-span-5 flex flex-col items-center md:items-start">
            <h3 className="text-[var(--brand-text)] font-semibold mb-6 text-lg tracking-wide">¿Tienes una idea?</h3>
            
            <div className="flex flex-col gap-4 w-full text-center md:text-left text-[var(--brand-text-muted)] mb-8">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-blue-400" size={14} />
                </div>
                <a href="mailto:cis@uni.edu.pe" className="hover:text-[var(--brand-text)] transition-colors text-sm md:text-base">cis@uni.edu.pe</a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-blue-400" size={14} />
                </div>
                <span className="text-sm md:text-base text-left">Universidad Nacional de Ingeniería, Lima, Perú</span>
              </div>
            </div>

            <Link 
              href="/contacto"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="relative z-10">Contáctanos ahora</span>
              <FaArrowRight className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

        </div>

        {/* Bottom part: Copyright and Institutional Logos */}
        <div className="pt-8 border-t border-[var(--brand-border)]/50 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-[var(--brand-text-muted)] opacity-60 text-sm">
            © {new Date().getFullYear()} IEEE Computational Intelligence Society UNI. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-8">
            <Image
              src="/images/ieee_white_logo.png"
              alt="IEEE Logo"
              width={100}
              height={25}
              className="h-6 w-auto object-contain opacity-40 hover:opacity-100 transition-all duration-300 logo-adaptive grayscale hover:grayscale-0"
            />
            <Image
              src="/images/logo_uni_white.png"
              alt="UNI Logo"
              width={80}
              height={30}
              className="h-8 w-auto object-contain opacity-40 hover:opacity-100 transition-all duration-300 logo-adaptive grayscale hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
