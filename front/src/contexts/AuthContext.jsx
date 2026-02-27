import React, { createContext, useState, useEffect } from 'react';
import * as userService from '@/api/userService';
import { useToast } from '@/components/ui/use-toast';
import { getToken, setToken, clearToken } from '@/lib/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const user = userService.getCurrentUser();
      const token = getToken();
      
      // Si on a un utilisateur mais pas de token, ou inversement, on nettoie
      if (user && !token) {
        clearToken();
        userService.clearToken();
        setCurrentUser(null);
      } else if (token && !user) {
        // Token présent mais pas d'utilisateur, on essaie de le récupérer
        try {
          const result = await userService.fetchCurrentUser();
          if (result.success) {
            setCurrentUser(result.user);
          } else {
            clearToken();
          }
        } catch (error) {
          clearToken();
        }
      } else {
        setCurrentUser(user);
      }
      
      setLoading(false);
    };

    initAuth();
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