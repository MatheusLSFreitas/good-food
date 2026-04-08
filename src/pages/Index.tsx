import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/store/useStore";

const Index = () => {
  const products = useStore((s) => s.products);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-foreground">Cardápio</h1>
          <p className="text-muted-foreground">
            Escolha seus itens e retire sem fila!
          </p>
        </div>
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum produto disponível.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
