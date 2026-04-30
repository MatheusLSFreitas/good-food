import { CartDrawer } from "./CartDrawer";
import { ClipboardList } from "lucide-react"; // Removi o UtensilsCrossed daqui
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          {/* AQUI ESTÁ A MUDANÇA: Substituímos o ícone pela sua logo */}
          <img 
            src="/logo.png" 
            alt="Logo Good Food" 
            className="w-10 h-10 object-contain" 
          />
          
          <span className="text-primary-foreground font-extrabold text-xl tracking-tight">
            Good Food
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/meus-pedidos"
            className="flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground font-semibold text-sm transition-colors min-h-[44px] px-2"
          >
            <ClipboardList size={18} />
            <span className="hidden sm:inline">Pedidos</span>
          </Link>
          <Link
            to="/admin"
            className="text-primary-foreground/80 hover:text-primary-foreground font-semibold text-sm transition-colors min-h-[44px] flex items-center px-2"
          >
            Painel
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}