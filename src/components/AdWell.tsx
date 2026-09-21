/**
 * Reserved ad well — holds a place for a single display unit without loading
 * one. Deliberately EMPTY: no AdSense call, no third-party script.
 *
 * Doctrine (design system §Hard doctrines, work order 21 Sep 2026):
 *  - max one ad per page, never adjacent to the player, never a pop-under;
 *  - on guide pages the slot is reserved, not filled, so the layout is final
 *    before any network decision and nothing shifts when a unit is added.
 *
 * When the slot is eventually filled it is by <AdSlot />, which renders
 * nothing unless NEXT_PUBLIC_ADSENSE_CLIENT is set.
 */
export default function AdWell({
  label = "Advertisement",
  minHeight = 250,
  className = "",
}: {
  label?: string;
  /** Reserved height in px, so enabling the slot causes no layout shift. */
  minHeight?: number;
  className?: string;
}) {
  return (
    <aside
      className={`w-ad-well flex flex-col items-center justify-center ${className}`}
      style={{ minHeight }}
      aria-label={label}
    >
      <span
        className="w-caps text-[10px] font-semibold"
        style={{ color: "var(--w-fg-faint)" }}
      >
        {label}
      </span>
    </aside>
  );
}
