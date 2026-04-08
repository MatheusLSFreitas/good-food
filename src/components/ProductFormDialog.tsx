import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types/order";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Product, "id">) => void;
  product?: Product | null;
}

export const ProductFormDialog = ({ open, onClose, onSave, product }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(String(product.price));
      setImage(product.image);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(price);
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: parsed,
      image: image.trim() || "/placeholder.svg",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prod-name">Nome</Label>
            <Input id="prod-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prod-desc">Descrição</Label>
            <Textarea id="prod-desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prod-price">Preço (R$)</Label>
            <Input id="prod-price" type="number" step="0.01" min="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prod-image">URL da imagem</Label>
            <Input id="prod-image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{product ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
