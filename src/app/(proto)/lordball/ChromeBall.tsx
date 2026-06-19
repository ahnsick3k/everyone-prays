export default function ChromeBall({ className }: { className?: string }) {
  return (
    <img
      src="/lordball-ball.png"
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
    />
  );
}
