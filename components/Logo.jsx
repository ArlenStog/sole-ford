export default function Logo({ dark = false }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 64 32" className="h-7 w-auto shrink-0 sm:h-9" aria-hidden="true">
        <ellipse cx="32" cy="16" rx="30" ry="14" fill={dark ? "#003478" : "#ffffff"} />
        <ellipse cx="32" cy="16" rx="27" ry="11.5" fill={dark ? "#ffffff" : "#003478"} />
        <text x="32" y="21" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="14" fill={dark ? "#003478" : "#ffffff"}>Sole</text>
      </svg>
      <span className={`whitespace-nowrap text-lg font-extrabold tracking-tight sm:text-xl ${dark ? "text-ford" : "text-white"}`}>
        SOLE <span className="text-accent">FORD</span>
      </span>
    </span>
  );
}
