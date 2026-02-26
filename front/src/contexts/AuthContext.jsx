import React, { createContext, useState, useEffect } from 'react';
import * as userService from '@/api/userService';
import { useToast } from '@/components/ui/use-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const user = userService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    try {
      const result = await userService.loginUser(phone, password);
      if (result.success) {
        setCurrentUser(result.user);
        toast({
          title: "Connexion réussie",
          description: "Ravi de vous revoir !",
        });
        return { success: true };
      } else {
        toast({
          title: "Erreur de connexion",
          description: result.error,
          variant: "destructive",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await userService.registerUser(userData);
      if (result.success) {
        setCurrentUser(result.user);
        toast({
          title: "Inscription réussie !",
          description: "Bienvenue au tournoi de Douala 2026",
        });
        return { success: true };
      } else {
        toast({
          title: "Erreur d'inscription",
          description: result.error,
          variant: "destructive",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await userService.logoutUser();
    setCurrentUser(null);
    toast({
      title: "Déconnecté",
      description: "À bientôt !",
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};