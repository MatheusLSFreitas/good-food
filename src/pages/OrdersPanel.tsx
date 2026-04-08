import { Header } from "@/components/Header";
import { useStore } from "@/store/useStore";
import { ChefHat, CheckCircle2, Clock } from "lucide-react";
import type { OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; className: string }> = {
  paid: { label: "Pago", icon: <Clock size={16} />, className: "bg-secondary text-secondary-foreground" },
  preparing: { label: "Preparando", icon: <ChefHat size={16} />, className: "bg-accent text-accent-foreground" },
  ready: { label: "Pronto", icon: <CheckCircle2 size={16} />, className: "bg-success text-success-foreground" },
};

const OrdersPanel = () => {
  const orders = useStore((s) => s.orders);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <h1 className="text-2xl font-extrabold text-foreground text-center">
          Painel de Pedidos
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum pedido ainda.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...orders].reverse().map((order) => {
              const config = statusConfig[order.status];
              return (
                <div
                  key={order.id}
                  className="bg-card rounded-lg border border-border p-4 space-y-3 animate-slide-up"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-primary">#{order.number}</span>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${config.className}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <p key={item.product.id} className="text-sm text-card-foreground">
                        {item.quantity}x {item.product.name}
                      </p>
                    ))}
                  </div>

                  <p className="font-extrabold text-foreground">
                    R$ {order.total.toFixed(2)}
                  </p>

                  <div className="flex gap-2">
                    {order.status === "paid" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                        className="flex-1 bg-accent text-accent-foreground py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                        Iniciar preparo
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "ready")}
                        className="flex-1 bg-success text-success-foreground py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                        Marcar como pronto
                      </button>
                    )}
                    {order.status === "ready" && (
                      <span className="flex-1 text-center text-success font-bold text-sm py-2">
                        ✅ Pedido pronto!
                      </span>
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

export default OrdersPanel;
