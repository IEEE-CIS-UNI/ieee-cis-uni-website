import Link from "next/link";
import { isExternalUrl } from "@/lib/url";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "secondary";
  className?: string;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const Button = ({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  size = "md",
  icon,
}: ButtonProps) => {
  // Hover y presión sutiles (2% / 3%), respuesta rápida al presionar
  const baseStyles = "inline-flex items-center justify-center font-bold transition duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] active:duration-100 rounded-lg group";
  
  const variants = {
    primary: "bg-brand-accent text-white hover:bg-brand-accent/90",
    /* Variant outline:
     * ─ borde azul tenue visible tanto en modo oscuro como en modo claro
     * ─ el texto mantiene el color del tema al hover (antes pasaba a blanco
     *   y desaparecía sobre el fondo claro)
     */
    outline: "border border-brand-accent/40 text-[var(--brand-text)] hover:border-brand-accent/70 hover:bg-brand-accent/10",
    secondary: "bg-brand-secondary text-white hover:bg-brand-secondary/90",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {icon && <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">{icon}</span>}
    </>
  );

  // Enlaces a otros sitios (demo, Instagram, registro…) se abren en otra pestaña
  // para que el usuario no abandone la web.
  if (href && isExternalUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses} onClick={onClick}>
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {content}
    </button>
  );
};

export default Button;
