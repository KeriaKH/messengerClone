import { LoginData } from "./loginData";
import { userData } from "./userData";

export interface AuthContextType {
  user: userData | null;
  Login: (userData: LoginData) => Promise<userData | { message: string }>;
  LogOut: () => void;
  isAuth: boolean;
}