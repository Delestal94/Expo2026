export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

/**
 * Puerto de autenticación (ver ADR-0002). El código de negocio depende
 * solo de esta interfaz — nunca del SDK concreto de Supabase, Clerk,
 * etc. — para poder cambiar de proveedor cambiando un adaptador y una
 * variable de entorno.
 */
export interface AuthProvider {
  signUp(email: string, password: string): Promise<AuthSession>;
  signIn(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
}
