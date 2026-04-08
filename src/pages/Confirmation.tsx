import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useStore } from "@/store/useStore";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const Confirmation = () => {
  const navigate = useNavigate();
  const currentOrder = useStore((s) => s.currentOrder);

  if (!currentOrder) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-md py-12 space-y-8 text-center">
        <div className="animate-scale-in space-y-4">
          <CheckCircle2 size={64} className="text-success mx-auto" />
          <h1 className="text-2xl font-extrabold text-foreground">Pedido Confirmado!</h1>
          <p className="text-muted-foreground">Apresente o número abaixo na retirada</p>
        </div>

        <div className="bg-primary rounded-2xl p-8 animate-slide-up shadow-lg">
          <p className="text-primary-foreground/80 text-sm font-bold uppercase tracking-wider">
            Número de Retirada
          </p>
          <p className="text-primary-foreground text-7xl font-extrabold mt-2">
            {currentOrder.number}
          </p>
          {currentOrder.customerName && (
            <p className="text-primary-foreground/80 text-lg font-bold mt-1">
              {currentOrder.customerName}
            </p>
          )}
        </div>

        <div className="bg-card rounded-lg border border-border p-4 space-y-2 text-left animate-slide-up">
          <p className="text-muted-foreground text-sm font-bold">Detalhes do pedido</p>
          {currentOrder.items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm text-card-foreground">
              <span>{item.quantity}x {item.product.name}</span>
              <span className="font-bold">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between font-extrabold text-foreground">
            <span>Total</span>
            <span className="text-primary">R$ {currentOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mx-auto text-primary font-bold hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={18} />
          Voltar ao cardápio
        </button>
      </main>
    </div>
  );
};

export default Confirmation;
