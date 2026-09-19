import { useState, useEffect } from "react";
import { Search } from "lucide-react";

type SearchTriggerProps = {
  onClick: () => void;
};

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  const [platformKey, setPlatformKey] = useState<string>("Ctrl K");

  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator) {
      const isMac =
        window.navigator.platform?.toUpperCase().indexOf("MAC") >= 0 ||
        window.navigator.userAgent?.toUpperCase().indexOf("MAC") >= 0;
      setPlatformKey(isMac ? "⌘K" : "Ctrl K");
    }
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-[#1A233A] bg-[#0B1020]/70 text-xs font-mono text-[#8792A8] hover:text-[#F4F7FB] hover:border-[#00E5F0]/40 hover:bg-[#0B1020] transition-all duration-200 shadow-sm"
      title="Open Command Palette"
    >
      <Search className="h-3.5 w-3.5 text-[#8792A8] group-hover:text-[#00E5F0] transition-colors" />
      <span className="text-xs font-medium">Search problems...</span>
      <kbd className="px-1.5 py-0.5 rounded-md border border-[#1A233A] bg-[#060814] text-[10px] font-mono text-[#8792A8] group-hover:text-[#F4F7FB] group-hover:border-[#00E5F0]/30 transition-all">
        {platformKey}
      </kbd>
    </button>
  );
}
