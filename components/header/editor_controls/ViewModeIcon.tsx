type ViewModeIconProps = {
  src: string;
  className?: string;
};

export function ViewModeIcon({ src, className }: ViewModeIconProps) {
  return (
    <img
      src={src}
      alt=""
      width={14}
      height={14}
      className={`h-3.5 w-3.5 shrink-0 object-contain ${className ?? ""}`}
      decoding="async"
    />
  );
}
