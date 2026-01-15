import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth, googleProvider } from "@/services/firebase";

export class AuthService {
  // Login com Google
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Falha ao fazer login com Google");
    }
  }

  // Logout
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Erro no logout:", error);
      throw new Error("Falha ao fazer logout");
    }
  }

  // Observar mudanças no estado de autenticação
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Pegar usuário atual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export const authService = new AuthService();