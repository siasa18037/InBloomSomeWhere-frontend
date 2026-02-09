const PLACEHOLDER =
  "https://placehold.co/400x300?text=InBloom+Somewhere";

export default function ProductImage({ src, alt }) {
  return (
    <img
      src={src ? src : PLACEHOLDER}
      alt={alt}
      className="card-img-top"
      style={{ objectFit: "cover", height: 220 }}
      onError={(e) => (e.target.src = PLACEHOLDER)}
    />
  );
}
