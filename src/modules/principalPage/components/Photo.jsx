import { unsplash } from "../data/landingContent";

const WIDTHS = [640, 1080, 1600, 2200];

export default function Photo({ id, alt, className = "", sizes = "100vw", eager = false, ...rest }) {
  return (
    <img
      src={unsplash(id, 1600)}
      srcSet={WIDTHS.map((w) => `${unsplash(id, w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}
