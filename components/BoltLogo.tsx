interface BoltLogoProps {
  className?: string;
  size?: number;
}

export default function BoltLogo({ className = '', size = 22 }: BoltLogoProps) {
  return (
    <span
      className={`inline-flex items-center font-extrabold tracking-tight ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
    >
      B
      <span
        className="inline-block bg-current rounded-full mx-[1px]"
        style={{ width: size * 0.27, height: size * 0.27 }}
      />
      lt
    </span>
  );
}
