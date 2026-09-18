/**
 * Mobile-only sticky action bar (mobile-webapp-ux: primary action stays
 * reachable throughout long task pages). Fixed to the viewport bottom on
 * phones only; a flow spacer keeps the footer/content uncovered.
 */
export default function MobileActionBar({ href, label, note }) {
  return (
    <>
      <div className="h-[104px] lg:hidden" aria-hidden="true" />
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-charcoal/95 px-4 pt-3 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#25D366] text-[15px] font-bold text-[#0b3d20] transition hover:brightness-110"
        >
          {label}
        </a>
        {note && <p className="mt-1 text-center text-[11px] text-cream/50">{note}</p>}
      </div>
    </>
  );
}
