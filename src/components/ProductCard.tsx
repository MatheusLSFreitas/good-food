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
    <div className="group bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow animate-slide-up">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          width={512}
          height={384}
        />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-card-foreground text-base leading-tight">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-extrabold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all min-h-[44px]"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
