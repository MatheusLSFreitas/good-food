import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatBRL } from "@/lib/utils";

export function CartDrawer() {
  const cart = useStore((s) => s.cart);
  const cartTotal = useStore((s) => s.cartTotal);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const total = cartTotal();
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ShoppingCart size={22} />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-scale-in">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-background w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-foreground text-xl font-extrabold">
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center text-base">
              Seu carrinho está vazio.<br />
              Adicione itens do cardápio!
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 mt-4 pr-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-card rounded-xl p-3 border border-border"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-card-foreground text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-primary font-extrabold text-sm">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-border transition-colors active:scale-95 min-w-[36px]"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-bold text-foreground w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-border transition-colors active:scale-95 min-w-[36px]"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto text-destructive hover:opacity-70 transition-opacity p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-4 space-y-4 pb-2">
              <div className="flex justify-between text-lg font-extrabold text-foreground">
                <span>Total</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/payment");
                }}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all min-h-[52px]"
              >
                Finalizar Pedido
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
