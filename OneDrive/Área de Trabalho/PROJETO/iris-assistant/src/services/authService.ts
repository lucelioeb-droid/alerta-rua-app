// src/services/authService.ts
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export class AuthService {
  // Login com Google
  async loginWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Login bem-sucedido:", result.user.displayName);
      return result.user;
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log("✅ Logout bem-sucedido");
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      throw error;
    }
  }

  // Observar mudanças de autenticação
  onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Pegar usuário atual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Verificar se está logado
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }
}

export const authService = new AuthService();