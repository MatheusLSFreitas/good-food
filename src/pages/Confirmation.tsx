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
      <main className="container max-w-md px-4 py-8 sm:py-12 space-y-6 text-center">
        <div className="animate-scale-in space-y-3">
          <CheckCircle2 size={72} className="text-success mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Pedido Confirmado!</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Apresente o número abaixo na retirada</p>
        </div>

        <div className="bg-primary rounded-2xl p-8 sm:p-10 animate-slide-up shadow-xl">
          <p className="text-primary-foreground/80 text-xs sm:text-sm font-bold uppercase tracking-widest">
            Número de Retirada
          </p>
          <p className="text-primary-foreground text-8xl sm:text-9xl font-extrabold mt-3 leading-none">
            {currentOrder.number}
          </p>
          {currentOrder.customerName && (
            <p className="text-primary-foreground/90 text-xl sm:text-2xl font-bold mt-3">
              {currentOrder.customerName}
            </p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-4 space-y-2 text-left animate-slide-up">
          <p className="text-muted-foreground text-sm font-bold">Detalhes do pedido</p>
          {currentOrder.items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm text-card-foreground py-0.5">
              <span>{item.quantity}x {item.product.name}</span>
              <span className="font-bold">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between font-extrabold text-foreground">
            <span>Total</span>
            <span className="text-primary">R$ {currentOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate("/meus-pedidos")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity min-h-[48px]"
          >
            Acompanhar pedido
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity min-h-[48px] px-4"
          >
            <ArrowLeft size={20} />
            Voltar ao cardápio
          </button>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
