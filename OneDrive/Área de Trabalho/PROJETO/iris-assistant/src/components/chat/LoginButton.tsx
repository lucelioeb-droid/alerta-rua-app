// src/components/LoginButton.tsx
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { User } from "firebase/auth";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface LoginButtonProps {
  onUserChange?: (user: User | null) => void;
}

const LoginButton = ({ onUserChange }: LoginButtonProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Observa mudanças de autenticação
    const unsubscribe = authService.onAuthChange((currentUser) => {
      setUser(currentUser);
      if (onUserChange) {
        onUserChange(currentUser);
      }
    });

    return () => unsubscribe();
  }, [onUserChange]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.loginWithGoogle();
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer login");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {/* Avatar e nome */}
        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "Usuário"}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <UserIcon size={16} className="text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {user.displayName?.split(" ")[0] || "Usuário"}
          </span>
        </div>

        {/* Botão de logout */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="p-2 rounded-full hover:bg-muted iris-transition disabled:opacity-50"
          title="Sair"
        >
          <LogOut size={18} className="text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 iris-transition disabled:opacity-50"
    >
      <LogIn size={18} />
      <span className="text-sm font-medium">
        {loading ? "Entrando..." : "Entrar com Google"}
      </span>
    </button>
  );
};

export default LoginButton;