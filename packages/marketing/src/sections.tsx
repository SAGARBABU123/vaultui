import type { ReactNode } from "react";
import { cn } from "@vaultui/utils";
import { Accordion, Button, Input } from "@vaultui/ui";

/* data types stay here for consumers */
export interface HeroSectionProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** Primary + secondary action slots (buttons). */
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function HeroSection({ eyebrow, title, body, primaryAction, secondaryAction, className }: HeroSectionProps) {
  return (
    <section className={cn("vault-mk-hero", className)}>
      <div className="vault-mk-hero__glow" aria-hidden="true" />
      <div className="vault-mk-hero__inner">
        {eyebrow && <p className="vault-mk-eyebrow">{eyebrow}</p>}
        <h2 className="vault-mk-hero__title">{title}</h2>
        {body && <p className="vault-mk-hero__body">{body}</p>}
        {(primaryAction || secondaryAction) && (
          <div className="vault-mk-hero__actions">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </section>
  );
}

export interface Feature {
  icon?: ReactNode;
  title: ReactNode;
  body: ReactNode;
}

export interface FeatureGridProps {
  features: Feature[];
  className?: string;
}

export function FeatureGrid({ features, className }: FeatureGridProps) {
  return (
    <div className={cn("vault-mk-features", className)}>
      {features.map((f, i) => (
        <div key={i} className="vault-mk-feature">
          {f.icon && <span className="vault-mk-feature__icon">{f.icon}</span>}
          <h3 className="vault-mk-feature__title">{f.title}</h3>
          <p className="vault-mk-feature__body">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

export interface Stat {
  value: ReactNode;
  label: ReactNode;
}

export interface StatBandProps {
  stats: Stat[];
  className?: string;
}

export function StatBand({ stats, className }: StatBandProps) {
  return (
    <div className={cn("vault-mk-stats", className)}>
      {stats.map((s, i) => (
        <div key={i} className="vault-mk-stat">
          <div className="vault-mk-stat__value">{s.value}</div>
          <div className="vault-mk-stat__label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export interface TestimonialProps {
  quote: ReactNode;
  name: ReactNode;
  role?: ReactNode;
  src?: string;
  className?: string;
}

export function Testimonial({ quote, name, role, src, className }: TestimonialProps) {
  return (
    <figure className={cn("vault-mk-testimonial", className)}>
      <blockquote className="vault-mk-testimonial__quote">{quote}</blockquote>
      <figcaption className="vault-mk-testimonial__person">
        {src ? <img src={src} alt="" className="vault-mk-avatar" /> : <span className="vault-mk-avatar vault-mk-avatar--initials">{initials(String(name))}</span>}
        <span>
          <div className="vault-mk-testimonial__name">{name}</div>
          {role && <div className="vault-mk-testimonial__role">{role}</div>}
        </span>
      </figcaption>
    </figure>
  );
}

export interface TestimonialGridProps {
  testimonials: TestimonialProps[];
  className?: string;
}

export function TestimonialGrid({ testimonials, className }: TestimonialGridProps) {
  return (
    <div className={cn("vault-mk-features", className)}>
      {testimonials.map((t, i) => (
        <Testimonial key={i} {...t} />
      ))}
    </div>
  );
}

export interface LogosStripProps {
  names: string[];
  className?: string;
}

export function LogosStrip({ names, className }: LogosStripProps) {
  return (
    <div className={cn("vault-mk-logos", className)} aria-label="Trusted by">
      {names.map((n) => (
        <span key={n} className="vault-mk-logos__name">
          {n}
        </span>
      ))}
    </div>
  );
}

export interface FaqItem {
  question: ReactNode;
  answer: ReactNode;
}

export interface FaqSectionProps {
  items: FaqItem[];
  className?: string;
}

export function FaqSection({ items, className }: FaqSectionProps) {
  return (
    <div className={cn("vault-mk-faq", className)}>
      <Accordion
        items={items.map((i) => ({
          title: i.question,
          content: <p style={{ margin: 0 }}>{i.answer}</p>,
        }))}
      />
    </div>
  );
}

export interface NewsletterSignupProps {
  placeholder?: string;
  buttonLabel?: string;
  note?: ReactNode;
  onSubscribe?: (email: string) => void;
  className?: string;
}

export function NewsletterSignup({ placeholder = "you@company.com", buttonLabel = "Subscribe", note, onSubscribe, className }: NewsletterSignupProps) {
  return (
    <form
      className={cn("vault-mk-newsletter", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = String(data.get("email") ?? "");
        if (email) onSubscribe?.(email);
      }}
    >
      <Input name="email" type="email" placeholder={placeholder} required className="vault-mk-newsletter__input" />
      <Button type="submit" className="vault-btn-primary">{buttonLabel}</Button>
      {note && <p className="vault-mk-newsletter__note">{note}</p>}
    </form>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}