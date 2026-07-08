// AuthContext.js — cria o "canal" do Context e o atalho para consumi-lo.
// Fica separado do AuthProvider por boa prática (e para o Fast Refresh do Vite).

import { createContext, useContext } from "react";

// O Context é como um "canal de rádio" global: o Provider transmite os dados
// (usuário, funções de login...) e qualquer componente sintoniza com useAuth().
export const AuthContext = createContext(null);

// Hook de conveniência: em vez de escrever useContext(AuthContext) em toda tela,
// chamamos useAuth(). Também avisa com erro claro se for usado fora do Provider.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
