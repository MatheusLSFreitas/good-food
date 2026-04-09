import { Header } from "@/components/Header";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { ChefHat, CheckCircle2, Clock, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  paid: { label: "Pago", icon: <Clock size={14} />, color: "bg-secondary text-secondary-foreground" },
  preparing: { label: "Preparando", icon: <ChefHat size={14} />, color: "bg-accent text-accent-foreground" },
  ready: { label: "Pronto", icon: <CheckCircle2 size={14} />, color: "bg-success text-success-foreground" },
};

const MyOrders = () => {
  const orders = useStore((s) => s.orders);
  const myOrderIds = useStore((s) => s.myOrderIds);

  // Force re-render every 3 seconds to pick up status changes
  useEffect(() => {
    const interval = setInterval(() => {
      useStore.getState(); // triggers subscription
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const myOrders = orders.filter((o) => myOrderIds.includes(o.id));
  const sortedOrders = [...myOrders].reverse();

  return (
    <div className="min-h-screen bg-background w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      <main className="container max-w-lg px-4 py-6 space-y-4">
        <h1 className="text-2xl font-extrabold text-foreground text-center">Meus Pedidos</h1>

        {sortedOrders.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <ShoppingBag size={48} className="text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold min-h-[48px] hover:opacity-90 transition-opacity"
            >
              Ver cardápio
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOrders.map((order) => {
              const config = statusConfig[order.status];
              return (
                <div
                  key={order.id}
                  className="bg-card rounded-xl border border-border p-4 space-y-3 animate-slide-up"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-primary">#{order.number}</span>
                      {order.customerName && (
                        <span className="text-sm font-bold text-muted-foreground">– {order.customerName}</span>
                      )}
                    </div>
                    <Badge className={`${config.color} gap-1 text-xs font-bold`}>
                      {config.icon}
                      {config.label}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <p key={item.product.id} className="text-sm text-card-foreground">
                        {item.quantity}x {item.product.name}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border">
                    <span className="font-extrabold text-foreground">R$ {order.total.toFixed(2)}</span>
                    {order.status === "ready" && (
                      <span className="text-success font-bold text-sm">✅ Pronto para retirada!</span>
                    )}
                    {order.status === "preparing" && (
                      <span className="text-accent-foreground font-bold text-sm animate-pulse">🍳 Sendo preparado...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
