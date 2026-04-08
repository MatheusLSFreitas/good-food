import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useStore } from "@/store/useStore";
import { CreditCard, QrCode, Loader2, CheckCircle2 } from "lucide-react";

type PaymentMethod = "pix" | "card" | null;
type PaymentState = "choosing" | "details" | "processing" | "approved";

const Payment = () => {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const cartTotal = useStore((s) => s.cartTotal);
  const createOrder = useStore((s) => s.createOrder);
  const clearCart = useStore((s) => s.clearCart);
  const setCurrentOrder = useStore((s) => s.setCurrentOrder);
  const total = cartTotal();

  const [method, setMethod] = useState<PaymentMethod>(null);
  const [state, setState] = useState<PaymentState>("choosing");
  const [customerName, setCustomerName] = useState("");

  if (cart.length === 0 && state !== "approved") {
    navigate("/");
    return null;
  }

  const processPayment = () => {
    setState("processing");
    setTimeout(() => {
      setState("approved");
      const order = createOrder([...cart], total, customerName);
      setCurrentOrder(order);
      clearCart();
      setTimeout(() => navigate("/confirmation"), 1500);
    }, 2000);
  };

  if (state === "processing") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-slide-up">
          <Loader2 size={48} className="text-primary animate-spin" />
          <p className="text-xl font-bold text-foreground">Processando pagamento...</p>
        </div>
      </div>
    );
  }

  if (state === "approved") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-scale-in">
          <CheckCircle2 size={64} className="text-success" />
          <p className="text-2xl font-extrabold text-foreground">Pagamento aprovado ✅</p>
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-lg py-8 space-y-6">
        <h1 className="text-2xl font-extrabold text-foreground text-center">Pagamento</h1>
        <div className="bg-card rounded-lg border border-border p-4 space-y-2">
          <p className="text-muted-foreground text-sm">Resumo do pedido</p>
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm text-card-foreground">
              <span>{item.quantity}x {item.product.name}</span>
              <span className="font-bold">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between font-extrabold text-foreground text-lg">
            <span>Total</span>
            <span className="text-primary">R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 space-y-2">
          <label className="text-sm font-bold text-card-foreground">Seu nome</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Digite seu nome"
            maxLength={50}
            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {!method ? (
          <div className="space-y-3">
            <p className="font-bold text-foreground text-center">Escolha a forma de pagamento</p>
            <button
              onClick={() => { setMethod("pix"); setState("details"); }}
              className="w-full flex items-center gap-3 bg-card border-2 border-border hover:border-primary rounded-lg p-4 transition-colors"
            >
              <QrCode size={28} className="text-primary" />
              <div className="text-left">
                <p className="font-bold text-card-foreground">PIX</p>
                <p className="text-muted-foreground text-sm">Pagamento instantâneo</p>
              </div>
            </button>
            <button
              onClick={() => { setMethod("card"); setState("details"); }}
              className="w-full flex items-center gap-3 bg-card border-2 border-border hover:border-primary rounded-lg p-4 transition-colors"
            >
              <CreditCard size={28} className="text-primary" />
              <div className="text-left">
                <p className="font-bold text-card-foreground">Cartão</p>
                <p className="text-muted-foreground text-sm">Crédito ou débito</p>
              </div>
            </button>
          </div>
        ) : method === "pix" ? (
          <div className="bg-card rounded-lg border border-border p-6 space-y-4 text-center animate-slide-up">
            <p className="font-bold text-card-foreground text-lg">Pague com PIX</p>
            <div className="mx-auto w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <QrCode size={120} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm animate-pulse-slow">Aguardando pagamento...</p>
            <button
              onClick={processPayment}
              className="w-full bg-success text-success-foreground py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Já paguei
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-6 space-y-4 animate-slide-up">
            <p className="font-bold text-card-foreground text-lg text-center">Dados do Cartão</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Número do cartão"
                maxLength={19}
                className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                placeholder="Nome do titular"
                className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/AA"
                  maxLength={5}
                  className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={4}
                  className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <button
              onClick={processPayment}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Pagar R$ {total.toFixed(2)}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payment;
