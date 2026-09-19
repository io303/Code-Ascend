import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

type NavbarItemProps = {
  to: string;
  label: string;
  isAnchor?: boolean;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function NavbarItem({
  to,
  label,
  isAnchor = false,
  isActive = false,
  onClick,
}: NavbarItemProps) {
  if (isAnchor) {
    return (
      <a
        href={to}
        onClick={onClick}
        className={[
          "relative px-3 py-2 text-xs font-mono font-semibold transition-all duration-180 select-none flex items-center rounded-xl whitespace-nowrap",
          isActive
            ? "text-arena-purple font-bold bg-arena-surface-purple"
            : "text-arena-text-secondary hover:text-arena-text hover:bg-arena-surface-subtle",
        ].join(" ")}
      >
        <span className="relative z-10">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeNavIndicatorPublic"
            className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-arena-purple rounded-full"
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
          />
        )}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative px-3.5 py-2 text-xs font-mono font-semibold transition-all duration-180 select-none flex items-center rounded-xl",
          isActive
            ? "text-arena-purple font-bold bg-arena-surface-purple"
            : "text-arena-text-secondary hover:text-arena-text hover:bg-arena-surface-subtle",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative z-10">{label}</span>
          {isActive && (
            <motion.div
              layoutId="activeNavIndicator"
              className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-arena-purple rounded-full"
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
