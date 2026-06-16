export default function ProtoCompleteChip({
  label = "입력 완료",
  onClick,
  className,
}: Readonly<{
  label?: string;
  onClick: () => void;
  className?: string;
}>) {
  return (
    <button
      type="button"
      className={["proto-complete-chip", className].filter(Boolean).join(" ")}
      aria-label={label}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <span className="proto-complete-chip-key">↵</span>
      <span>{label}</span>
    </button>
  );
}
