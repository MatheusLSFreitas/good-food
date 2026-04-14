import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useStore } from "@/store/useStore";

const Payment = () => {
  const navigate = useNavigate();

  const cart = useStore((s) => s.cart);
  const clearCart = useStore((s) => s.clearCart);
  const cartTotal = useStore((s) => s.cartTotal);
  const createOrder = useStore((s) => s.createOrder);
  const setCurrentOrder = useStore((s) => s.setCurrentOrder);

  const [customerName, setCustomerName] = useState("");
  const [state, setState] = useState<"idle" | "processing" | "approved">("idle");

  const total = cartTotal();

  const processPayment = async () => {
    if (!customerName.trim()) {
      alert("Digite seu nome");
      return;
    }

    setState("processing");

    try {
      console.log("Criando pedido...");

      const order = await createOrder([...cart], total, customerName);

      console.log("Pedido criado:", order);

      setCurrentOrder(order);
      clearCart();

      setState("approved");

      setTimeout(() => {
        navigate("/confirmation");
      }, 1500);

    } catch (error) {
      console.error("ERRO NO PAGAMENTO:", error);
      alert("Erro ao finalizar pedido");
      setState("idle");
    }
  };

  if (state === "processing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl font-bold">Processando pagamento...</p>
      </div>
    );
  }

  if (state === "approved") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-green-600">
          Pagamento aprovado!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-md px-4 py-6 space-y-4">
        <h1 className="text-2xl font-extrabold text-center">
          Finalizar Pedido
        </h1>

        <input
          type="text"
          placeholder="Seu nome"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <div className="bg-card border p-4 rounded">
          <p className="font-bold">Resumo</p>

          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <span>
                {item.quantity}x {item.product.name}
              </span>
              <span>
                R$ {(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={processPayment}
          className="w-full bg-primary text-white p-3 rounded font-bold"
        >
          Pagar
        </button>
      </main>
    </div>
  );
};

export default Payment;