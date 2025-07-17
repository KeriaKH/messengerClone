"use client";

import { getUserData, isLogin, login, logOut } from "@/services/authService";
import { AuthContextType } from "@/types/customeType/AuthContextType";
import { LoginData } from "@/types/customeType/loginData";
import { userData } from "@/types/customeType/userData";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userData | null>(getUserData());

  useEffect(() => {
    if (isLogin()) {
      setUser(getUserData());
    }

  }, []);

  const Login = async (loginData:LoginData) => {
    const res = await login(loginData.email, loginData.password);
    if ("token" in res) setUser(res as userData);
    return res;
  };

  const LogOut=()=>{
    logOut()
    setUser(null)
  }

  return(
    <AuthContext.Provider value={{user,Login,LogOut,isAuth:!!user}}>
        {children}
    </AuthContext.Provider>
  )
};

export const useAuth=():AuthContextType=>{
    const context =useContext(AuthContext)
    if(!context)
    {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context
}
