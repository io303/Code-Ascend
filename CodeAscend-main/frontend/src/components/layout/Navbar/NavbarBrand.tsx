import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import codearenaMark from "@/assets/branding/codearena-mark.png";

type NavbarBrandProps = {
  isPublic?: boolean;
};

export function NavbarBrand({ isPublic = false }: NavbarBrandProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const targetPath = isAuthenticated && !isPublic ? "/dashboard" : "/";

  return (
    <Link
      to={targetPath}
      className="flex items-center gap-2.5 group relative select-none"
      title="CodeAscend Platform"
    >
      {/* Official CA Logo Mark */}
      <img
        src={codearenaMark}
        alt="CodeAscend Logo"
        className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />

      {/* Brand Text */}
      <div className="flex items-baseline font-heading font-extrabold text-lg sm:text-xl tracking-tight">
        <span className="text-arena-text transition-colors duration-200">
          Code
        </span>
        <span className="text-arena-purple font-extrabold tracking-tight">
          Ascend
        </span>
      </div>
    </Link>
  );
}
