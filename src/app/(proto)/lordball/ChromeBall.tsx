// Compatibility wrapper — delegates to the soap bubble implementation.
import CssBall from "./CssBall";

export default function ChromeBall({ className }: { className?: string }) {
  return <CssBall className={className} />;
}
