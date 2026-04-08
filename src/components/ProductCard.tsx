import { Plus } from "lucide-react";
import { Product } from "@/types/order";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((s) => s.addToCart);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} adicionado!`);
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow animate-slide-up">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          width={512}
          height={512}
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-card-foreground text-lg leading-tight">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-snug">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-extrabold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
