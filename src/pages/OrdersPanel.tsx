import { useState } from "react";
import { Header } from "@/components/Header";
import { useStore } from "@/store/useStore";
import { ChefHat, CheckCircle2, Clock, Plus, Pencil, Trash2, Package, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductFormDialog } from "@/components/ProductFormDialog";
import type { OrderStatus, Product } from "@/types/order";
import { toast } from "sonner";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; className: string }> = {
  paid: { label: "Pago", icon: <Clock size={16} />, className: "bg-secondary text-secondary-foreground" },
  preparing: { label: "Preparando", icon: <ChefHat size={16} />, className: "bg-accent text-accent-foreground" },
  ready: { label: "Pronto", icon: <CheckCircle2 size={16} />, className: "bg-success text-success-foreground" },
};

const OrdersPanel = () => {
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    deleteProduct(product.id);
    toast.success(`"${product.name}" removido`);
  };

  const handleSave = (data: Omit<Product, "id">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      toast.success("Produto atualizado!");
    } else {
      addProduct(data);
      toast.success("Produto adicionado!");
    }
  };

  return (
    <div className="min-h-screen bg-background w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      <main className="container py-6 px-4">
        <h1 className="text-2xl font-extrabold text-foreground text-center mb-6">Painel Administrativo</h1>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="orders" className="gap-2 text-sm font-bold">
              <Package size={16} /> Pedidos
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2 text-sm font-bold">
              <UtensilsCrossed size={16} /> Produtos
            </TabsTrigger>
          </TabsList>

          {/* ─── Pedidos ─── */}
          <TabsContent value="orders" className="space-y-4">
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
                        <div>
                          <span className="text-3xl font-extrabold text-primary">#{order.number}</span>
                          {order.customerName && (
                            <span className="ml-2 text-sm font-bold text-muted-foreground">– {order.customerName}</span>
                          )}
                        </div>
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
                      <p className="font-extrabold text-foreground">R$ {order.total.toFixed(2)}</p>
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
          </TabsContent>

          {/* ─── Produtos ─── */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground">Gerenciar Produtos</h2>
              <Button onClick={handleAdd} size="sm" className="gap-1">
                <Plus size={16} /> Adicionar
              </Button>
            </div>

            {products.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum produto cadastrado.</p>
            ) : (
              <div className="grid gap-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 bg-card border border-border rounded-lg p-3"
                  >
                    <img src={p.image} alt={p.name} className="w-14 h-14 rounded-md object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-card-foreground truncate">{p.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{p.description}</p>
                      <p className="text-sm font-extrabold text-primary">R$ {p.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p)} className="text-destructive hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ProductFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
};

export default OrdersPanel;
