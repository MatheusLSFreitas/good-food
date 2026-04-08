import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, Lock } from "lucide-react";
import { toast } from "sonner";

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

const AdminLogin = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem("admin_auth", "true");
      navigate("/orders", { replace: true });
    } else {
      toast.error("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
            <UtensilsCrossed size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">Faça login para acessar o painel de pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6">
          <div className="space-y-2">
            <Label htmlFor="user">Usuário</Label>
            <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pass">Senha</Label>
            <Input id="pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••" required />
          </div>
          <Button type="submit" className="w-full gap-2">
            <Lock size={16} /> Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
