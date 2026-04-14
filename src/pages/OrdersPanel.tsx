import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";

interface ItemPedido {
  nome_item: string;
  quantidade: number;
}

interface Pedido {
  id: number;
  mesa: number;
  observacoes: string;
  created_at: string;
  itens: ItemPedido[];
}

const OrdersPanel = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const fetchPedidos = async () => {
    // 🔥 busca pedidos
    const { data: pedidosData, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro pedidos:", error);
      return;
    }

    // 🔥 busca itens de cada pedido
    const pedidosComItens = await Promise.all(
      (pedidosData || []).map(async (pedido) => {
        const { data: itens } = await supabase
          .from("itens_pedido")
          .select("*")
          .eq("pedido_id", pedido.id);

        return {
          ...pedido,
          itens: itens || [],
        };
      })
    );

    setPedidos(pedidosComItens);
  };

  useEffect(() => {
    fetchPedidos();

    // 🔄 atualiza a cada 3 segundos
    const interval = setInterval(fetchPedidos, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-lg px-4 py-6 space-y-4">
        <h1 className="text-2xl font-extrabold text-center">
          Painel de Pedidos
        </h1>

        {pedidos.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum pedido ainda
          </p>
        ) : (
          pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-card border border-border rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between">
                <h2 className="font-bold text-lg">
                  Pedido #{pedido.id}
                </h2>
                <span className="text-sm text-muted-foreground">
                  Mesa {pedido.mesa}
                </span>
              </div>

              {pedido.observacoes && (
                <p className="text-sm">
                  Obs: {pedido.observacoes}
                </p>
              )}

              <div className="space-y-1">
                {pedido.itens.map((item, index) => (
                  <p key={index} className="text-sm">
                    {item.quantidade}x {item.nome_item}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default OrdersPanel;