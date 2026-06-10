import CssBall from "./CssBall";

/**
 * The reference orb is closer to a composited 2D liquid-plum render than the
 * previous live WebGL sphere, so keep the main Lordball orb on the CSS path
 * for tighter visual matching and identical output across browsers.
 */
export default function ChromeBall({ className }: { className?: string }) {
  return <CssBall className={className} />;
}
