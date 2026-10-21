import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductFormDialog } from "@/components/ProductFormDialog";
import { useStore } from "@/store/useStore";
import { formatBRL } from "@/lib/utils";
import {
  Pencil,
  Trash2,
  Plus,
  Package,
  ShoppingBag,
  ChefHat,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";
import type { Product } from "@/types/order";
import { toast } from "sonner";

interface ItemPedido {
  nome_item: string;
  quantidade: number;
}

type PedidoStatus = "pago" | "preparando" | "pronto" | "cancelado" | "entregue";

interface Pedido {
  id: number;
  mesa: number;
  observacoes: string;
  created_at: string;
  status?: PedidoStatus;
  entregue_em?: string | null;
  itens: ItemPedido[];
}

const statusConfig: Record<PedidoStatus, { label: string; variant: "info" | "warning" | "success" | "destructive" | "muted" }> = {
  pago: { label: "Pago", variant: "info" },
  preparando: { label: "Preparando", variant: "warning" },
  pronto: { label: "Pronto", variant: "success" },
  cancelado: { label: "Cancelado", variant: "destructive" },
  entregue: { label: "Entregue", variant: "muted" },
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

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
    const entregueEm = status === "entregue" ? new Date().toISOString() : undefined;

    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, entregue_em: entregueEm ?? p.entregue_em } : p))
    );

    const payload = entregueEm ? { status, entregue_em: entregueEm } : { status };
    let { error } = await supabase.from("pedidos").update(payload).eq("id", id);

    // Se a coluna entregue_em ainda não existir no banco, salva só o status
    if (error && entregueEm) {
      ({ error } = await supabase.from("pedidos").update({ status }).eq("id", id));
    }

    if (error) {
      toast.error("Erro ao atualizar status");
      fetchPedidos();
    } else {
      toast.success(`Pedido #${id} → ${statusConfig[status].label}`);
    }
  };

  const confirmRetirada = (id: number) => {
    if (confirm(`Confirmar retirada do pedido #${id}?`)) {
      handleStatusChange(id, "entregue");
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

  // Colunas: pendentes mais antigos primeiro; entregues mais recentes primeiro
  const emPreparo = pedidos
    .filter((p) => p.status === "pago" || p.status === "preparando")
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
  const prontos = pedidos
    .filter((p) => p.status === "pronto")
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
  const entregues = pedidos
    .filter((p) => p.status === "entregue")
    .sort(
      (a, b) =>
        +new Date(b.entregue_em ?? b.created_at) - +new Date(a.entregue_em ?? a.created_at)
    );

  const PedidoCard = ({ pedido, action }: { pedido: Pedido; action?: React.ReactNode }) => {
    const status = pedido.status || "pago";
    return (
      <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
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

        {status === "entregue" && pedido.entregue_em && (
          <p className="text-xs text-muted-foreground">
            Retirado às {formatTime(pedido.entregue_em)}
          </p>
        )}

        {action}
      </div>
    );
  };

  const Column = ({
    title,
    icon,
    count,
    empty,
    scrollable,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    count: number;
    empty: string;
    scrollable?: boolean;
    children: React.ReactNode;
  }) => (
    <section className="bg-muted/40 border border-border rounded-xl p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
          {icon}
          {title}
        </h3>
        <Badge variant="secondary">{count}</Badge>
      </div>
      <div className={scrollable ? "space-y-3 max-h-[60vh] overflow-y-auto pr-1" : "space-y-3"}>
        {count === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">{empty}</p>
        ) : (
          children
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background w-full max-w-[100vw] overflow-x-hidden">
      <Header />

      <main className="container max-w-6xl px-4 py-6 space-y-4">
        <h1 className="text-2xl font-extrabold text-center">Painel Admin</h1>

        <Tabs defaultValue="pedidos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 max-w-md mx-auto">
            <TabsTrigger value="pedidos" className="h-10 text-base">
              <ShoppingBag className="w-4 h-4 mr-2" /> Pedidos
            </TabsTrigger>
            <TabsTrigger value="produtos" className="h-10 text-base">
              <Package className="w-4 h-4 mr-2" /> Produtos
            </TabsTrigger>
          </TabsList>

          {/* === Pedidos (kanban por status) === */}
          <TabsContent value="pedidos" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <Column
                title="Em preparo"
                icon={<ChefHat className="w-4 h-4 text-warning" />}
                count={emPreparo.length}
                empty="Nenhum pedido em preparo"
              >
                {emPreparo.map((pedido) => (
                  <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                    action={
                      <div className="pt-2 border-t">
                        {pedido.status === "pago" && (
                          <Button
                            variant="warning"
                            className="w-full min-h-[44px]"
                            onClick={() => handleStatusChange(pedido.id, "preparando")}
                          >
                            Iniciar preparo
                          </Button>
                        )}
                        {pedido.status === "preparando" && (
                          <Button
                            variant="success"
                            className="w-full min-h-[44px]"
                            onClick={() => handleStatusChange(pedido.id, "pronto")}
                          >
                            Marcar como pronto
                          </Button>
                        )}
                      </div>
                    }
                  />
                ))}
              </Column>

              <Column
                title="Prontos para retirada"
                icon={<CheckCircle2 className="w-4 h-4 text-success" />}
                count={prontos.length}
                empty="Nenhum pedido aguardando retirada"
              >
                {prontos.map((pedido) => (
                  <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                    action={
                      <div className="pt-2 border-t">
                        <Button
                          variant="success"
                          className="w-full min-h-[44px]"
                          onClick={() => confirmRetirada(pedido.id)}
                        >
                          Confirmar retirada
                        </Button>
                      </div>
                    }
                  />
                ))}
              </Column>

              <Column
                title="Entregues"
                icon={<PackageCheck className="w-4 h-4 text-muted-foreground" />}
                count={entregues.length}
                empty="Nenhum pedido entregue ainda"
                scrollable
              >
                {entregues.map((pedido) => (
                  <PedidoCard key={pedido.id} pedido={pedido} />
                ))}
              </Column>
            </div>
          </TabsContent>

          {/* === Produtos === */}
          <TabsContent value="produtos" className="space-y-3 mt-4 max-w-3xl mx-auto">
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
