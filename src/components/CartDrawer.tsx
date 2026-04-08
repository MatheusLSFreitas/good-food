import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
        <button className="relative bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all">
          <ShoppingCart size={22} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-background">
        <SheetHeader>
          <SheetTitle className="text-foreground text-xl font-extrabold">
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
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
                  className="flex gap-3 bg-card rounded-lg p-3 border border-border"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-md object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-card-foreground text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-primary font-extrabold text-sm">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-foreground hover:bg-border transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold text-foreground w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-foreground hover:bg-border transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto text-destructive hover:opacity-70 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <div className="flex justify-between text-lg font-extrabold text-foreground">
                <span>Total</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/payment");
                }}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all"
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
