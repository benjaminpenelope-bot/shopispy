export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-sm flex-shrink-0`}>
      <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[62%] h-[62%]">
        {/* Handle du sac — rappel Shopify */}
        <path d="M7.5 7.5C7.5 5.57 9.07 4 11 4C12.93 4 14.5 5.57 14.5 7.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
        {/* Corps du sac */}
        <path d="M5 7.5H17L15.8 17H6.2L5 7.5Z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
        {/* Loupe */}
        <circle cx="10.5" cy="12" r="2.1" stroke="white" strokeWidth="1.4" />
        <path d="M12 13.5L13.5 15" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
