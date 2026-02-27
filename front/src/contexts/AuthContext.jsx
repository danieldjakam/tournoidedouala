import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as userService from '@/api/userService';
import { useToast } from '@/components/ui/use-toast';
import { getToken, setToken, clearToken, setTokenExpiredCallback } from '@/lib/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Handle token expiration - called from apiClient when 401 is received
  const handleTokenExpired = useCallback(() => {
    setCurrentUser(null);
    toast({
      title: 'Session expirée',
      description: 'Veuillez vous reconnecter',
      variant: 'destructive',
    });
  }, [toast]);

  // Register the callback in apiClient
  useEffect(() => {
    setTokenExpiredCallback(handleTokenExpired);
  }, [handleTokenExpired]);

  useEffect(() => {
    const initAuth = async () => {
      const user = userService.getCurrentUser();
      const token = getToken();

      // Si on a un token mais pas d'utilisateur, on essaie de le récupérer
      if (token && !user) {
        try {
          const result = await userService.fetchCurrentUser();
          if (result.success) {
            setCurrentUser(result.user);
          } else {
            // Token invalide ou expiré
            clearToken();
            setCurrentUser(null);
          }
        } catch (error) {
          clearToken();
          setCurrentUser(null);
        }
      } 
      // Si on a un utilisateur mais pas de token, on nettoie
      else if (user && !token) {
        clearToken();
        userService.clearStoredUser();
        setCurrentUser(null);
      } 
      // Si on a un token et un utilisateur, on vérifie que le token est valide
      else if (token && user) {
        try {
          // Vérification silencieuse du token
          await userService.fetchCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          // Token expiré ou invalide
          clearToken();
          userService.clearStoredUser();
          setCurrentUser(null);
        }
      } 
      // Pas de token, pas d'utilisateur
      else {
        setCurrentUser(null);
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