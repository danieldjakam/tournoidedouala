import React, { createContext, useState, useEffect } from 'react';
import * as adminService from '@/api/adminService';
import { useToast } from '@/components/ui/use-toast';

export const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const admin = adminService.getCurrentAdmin();
    setCurrentAdmin(admin);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await adminService.loginAdmin(email, password);
      if (result.success) {
        return { success: true, requiresOTP: result.requiresOTP };
      } else {
        toast({
          title: "Erreur de connexion",
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

  const verifyOTP = async (email, otp) => {
    try {
      const result = await adminService.verifyOTP(email, otp);
      if (result.success) {
        setCurrentAdmin(result.admin);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace administrateur",
        });
        return { success: true };
      } else {
        toast({
          title: "Code incorrect",
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

  const logout = () => {
    adminService.logoutAdmin();
    setCurrentAdmin(null);
    toast({
      title: "Déconnecté",
      description: "Session admin terminée",
    });
  };

  return (
    <AdminAuthContext.Provider value={{
      currentAdmin,
      loading,
      login,
      verifyOTP,
      logout,
      isAuthenticated: !!currentAdmin
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};