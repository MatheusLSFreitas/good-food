import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductFormDialog } from "@/components/ProductFormDialog";
import { useStore } from "@/store/useStore";
import { formatBRL } from "@/lib/utils";
import { Pencil, Trash2, Plus, Package, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/order";
import { toast } from "sonner";

interface ItemPedido {
  nome_item: string;
  quantidade: number;
}

type PedidoStatus = "pago" | "preparando" | "pronto";

interface Pedido {
  id: number;
  mesa: number;
  observacoes: string;
  created_at: string;
  status?: PedidoStatus;
  itens: ItemPedido[];
}

const statusConfig: Record<PedidoStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pago: { label: "Pago", variant: "secondary" },
  preparando: { label: "Preparando", variant: "default" },
  pronto: { label: "Pronto", variant: "destructive" },
};

const OrdersPanel = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchPedidos = async () => {
    const { data: pedidosData, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro pedidos:", error);
      return;
    }

    const pedidosComItens = await Promise.all(
      (pedidosData || []).map(async (pedido) => {
        const { data: itens } = await supabase
          .from("itens_pedido")
          .select("*")
          .eq("pedido_id", pedido.id);
        return { ...pedido, itens: itens || [], status: (pedido.status as PedidoStatus) || "pago" };
      })
    );

    setPedidos(pedidosComItens);
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: number, status: PedidoStatus) => {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    const { error } = await supabase.from("pedidos").update({ status }).eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar status");
      fetchPedidos();
    } else {
      toast.success(`Pedido #${id} → ${statusConfig[status].label}`);
    }
  };

  const openNew = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setDialogOpen(true); };

  const handleSave = (data: Omit<Product, "id">) => {
    if (editing) {
      updateProduct(editing.id, data);
      toast.success("Produto atualizado");
    } else {
      addProduct(data);
      toast.success("Produto adicionado");
    }
  };

  const handleDelete = (p: Product) => {
    if (confirm(`Excluir "${p.name}"?`)) {
      deleteProduct(p.id);
      toast.success("Produto excluído");
    }
  };

  return (
    <div className="min-h-screen bg-background w-full max-w-[100vw] overflow-x-hidden">
      <Header />

      <main className="container max-w-3xl px-4 py-6 space-y-4">
        <h1 className="text-2xl font-extrabold text-center">Painel Admin</h1>

        <Tabs defaultValue="pedidos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="pedidos" className="h-10 text-base">
              <ShoppingBag className="w-4 h-4 mr-2" /> Pedidos
            </TabsTrigger>
            <TabsTrigger value="produtos" className="h-10 text-base">
              <Package className="w-4 h-4 mr-2" /> Produtos
            </TabsTrigger>
          </TabsList>

          {/* === Pedidos === */}
          <TabsContent value="pedidos" className="space-y-3 mt-4">
            {pedidos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum pedido ainda</p>
            ) : (
              pedidos.map((pedido) => {
                const status = pedido.status || "pago";
                return (
                  <div key={pedido.id} className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h2 className="font-bold text-lg">Pedido #{pedido.id}</h2>
                        <span className="text-xs text-muted-foreground">Mesa {pedido.mesa}</span>
                      </div>
                      <Badge variant={statusConfig[status].variant}>{statusConfig[status].label}</Badge>
                    </div>

                    {pedido.observacoes && (
                      <p className="text-sm break-words">Obs: {pedido.observacoes}</p>
                    )}

                    <div className="space-y-1">
                      {pedido.itens.map((item, i) => (
                        <p key={i} className="text-sm">{item.quantidade}x {item.nome_item}</p>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant={status === "pago" ? "default" : "outline"}
                        onClick={() => handleStatusChange(pedido.id, "pago")}
                        className="flex-1 min-w-[90px] min-h-[44px]"
                      >Pago</Button>
                      <Button
                        size="sm"
                        variant={status === "preparando" ? "default" : "outline"}
                        onClick={() => handleStatusChange(pedido.id, "preparando")}
                        className="flex-1 min-w-[90px] min-h-[44px]"
                      >Preparando</Button>
                      <Button
                        size="sm"
                        variant={status === "pronto" ? "default" : "outline"}
                        onClick={() => handleStatusChange(pedido.id, "pronto")}
                        className="flex-1 min-w-[90px] min-h-[44px]"
                      >Pronto</Button>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          {/* === Produtos === */}
          <TabsContent value="produtos" className="space-y-3 mt-4">
            <Button onClick={openNew} className="w-full min-h-[44px]">
              <Plus className="w-4 h-4 mr-2" /> Adicionar produto
            </Button>

            {products.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum produto cadastrado</p>
            ) : (
              products.map((p) => (
                <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex gap-3 shadow-sm">
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-bold break-words whitespace-normal">{p.name}</h3>
                    <p className="text-xs text-muted-foreground break-words whitespace-normal line-clamp-2">{p.description}</p>
                    <p className="text-sm font-semibold text-primary">{formatBRL(p.price)}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="icon" variant="outline" className="min-h-[44px] min-w-[44px]" onClick={() => openEdit(p)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="min-h-[44px] min-w-[44px]" onClick={() => handleDelete(p)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ProductFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        product={editing}
      />
    </div>
  );
};

export default OrdersPanel;
