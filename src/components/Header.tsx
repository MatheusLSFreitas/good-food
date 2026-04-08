import { CartDrawer } from "./CartDrawer";
import { UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed size={28} className="text-primary-foreground" />
          <span className="text-primary-foreground font-extrabold text-xl tracking-tight">
            UNASP Food
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="text-primary-foreground/80 hover:text-primary-foreground font-semibold text-sm transition-colors"
          >
            Painel
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
