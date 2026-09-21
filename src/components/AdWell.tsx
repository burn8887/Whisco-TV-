import { AD_UNIT_LIVE } from "@/lib/ads";

/**
 * Reserved ad well — holds a place for a single display unit without loading
 * one. Deliberately EMPTY: no AdSense call, no third-party script.
 *
 * COLLAPSED WHEN EMPTY (Desk ruling 21 Sep, P1). §4.3 requires an ad well to
 * either reserve a min-height or collapse — pick one per page and keep it.
 * Guide pages collapse: capping 27 guides with a 250px reserve and an
 * "Advertisement" label, when no approved unit exists, is a promise to the
 * reader the layout cannot keep.
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
  if (!AD_UNIT_LIVE) {
    // The caller's className is deliberately NOT spread here. In practice it is
    // only ever spacing (the guide page passes `mt-12`), and a 3rem top margin
    // on an empty box is exactly the hole this removes. The well stays in the
    // DOM so enabling a unit later is a config change, not a restructure.
    return (
      <aside className="w-ad-well w-ad-well--empty" style={{ minHeight: 0 }} aria-hidden="true" />
    );
  }

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
