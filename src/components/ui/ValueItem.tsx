import { IconType } from "react-icons";

interface ValueItemProps {
  title: string;
  description: string;
  icon: IconType;
}

const ValueItem = ({ title, description, icon: Icon }: ValueItemProps) => {
  return (
    /*
     * Contenedor del pilar de valor
     * ─ Borde sutil siempre visible (brand-border), se intensifica al hover
     * ─ Fondo base semitransparente para dar "presencia" sin hover
     * ─ Glow azul suave en el fondo al hover (pseudo-element)
     */
    <div className="group relative p-4 lg:p-6 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)]/60 hover:border-brand-accent/40 hover:bg-[var(--brand-card)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">

      {/* Halo de fondo azul al hover — capa absoluta detrás del contenido */}
      <div className="absolute inset-0 bg-brand-accent/0 group-hover:bg-brand-accent/5 rounded-xl blur-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] -z-10" />

      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">

        {/*
         * Contenedor del icono
         * ─ Tamaño aumentado: w-14 h-14 (antes w-12 h-12)
         * ─ Fondo azul tenue siempre visible (bg-brand-accent/10)
         * ─ Se intensifica al hover (group-hover:bg-brand-accent/25)
         */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center group-hover:bg-brand-accent/25 group-hover:border-brand-accent/40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
          <Icon className="text-brand-accent text-2xl group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
        </div>

        <div>
          {/* Título del pilar — pasa a azul al hover */}
          <h4 className="text-xl font-bold text-[var(--brand-text)] mb-2 group-hover:text-brand-accent transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
            {title}
          </h4>
          {/*
           * Descripción del pilar
           * ─ Cambiado de text-[var(--brand-text-muted)] a text-white/65
           *   para mejor contraste en fondo oscuro
           */}
          <p className="text-white/65 text-sm leading-relaxed transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValueItem;
