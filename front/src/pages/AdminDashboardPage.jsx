import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Users, Calendar, Star, Settings, LogOut, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import TeamManagement from '@/components/TeamManagement';
import MatchManagement from '@/components/MatchManagement';
import * as adminService from '@/api/adminService';
import * as userService from '@/api/userService';
import { format } from 'date-fns';

const AdminDashboardPage = () => {
  const { currentAdmin, logout } = useAdminAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const loadAuditLogs = () => {
    const logs = adminService.getAuditLogs();
    setAuditLogs(logs.slice(-50).reverse());
  };

  const loadUsers = () => {
    const allUsers = userService.getAllUsers();
    setUsers(allUsers);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Tournoi de Douala 2026</title>
        <meta name="description" content="Tableau de bord administrateur du tournoi" />
      </Helmet>

      <div className="min-h-screen bg-gray-100 font-sans">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-accent-red" />
                </div>
                <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm hidden md:inline">{currentAdmin?.email}</span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-accent-red text-accent-red hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
            Gestion du Tournoi
          </h1>

          <Tabs defaultValue="teams" className="space-y-6" onValueChange={(value) => {
            if (value === 'settings') loadAuditLogs();
            if (value === 'users') loadUsers();
          }}>
            <TabsList className="bg-white border border-gray-200 p-1 shadow-sm w-full md:w-auto overflow-x-auto flex justify-start">
              <TabsTrigger
                value="teams"
                className="data-[state=active]:bg-primary-blue data-[state=active]:text-white px-6"
              >
                <Users className="w-4 h-4 mr-2" />
                Équipes
              </TabsTrigger>
              <TabsTrigger
                value="matches"
                className="data-[state=active]:bg-primary-blue data-[state=active]:text-white px-6"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Matchs
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-primary-blue data-[state=active]:text-white px-6"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger
                value="motm"
                className="data-[state=active]:bg-primary-blue data-[state=active]:text-white px-6"
              >
                <Star className="w-4 h-4 mr-2" />
                MOTM
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-primary-blue data-[state=active]:text-white px-6"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teams">
              <TeamManagement adminId={currentAdmin?.id} />
            </TabsContent>

            <TabsContent value="matches">
              <MatchManagement adminId={currentAdmin?.id} />
            </TabsContent>

            <TabsContent value="users">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary-blue" />
                  Gestion des Utilisateurs ({users.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-900 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3 border-b border-gray-200">Nom</th>
                        <th className="px-4 py-3 border-b border-gray-200">Téléphone</th>
                        <th className="px-4 py-3 border-b border-gray-200">Sexe</th>
                        <th className="px-4 py-3 border-b border-gray-200">Date de Naissance</th>
                        <th className="px-4 py-3 border-b border-gray-200">Inscrit le</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-400">Aucun utilisateur inscrit</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-gray-900">
                              {user.firstname} {user.name}
                            </td>
                            <td className="px-4 py-3">{user.phone}</td>
                            <td className="px-4 py-3 capitalize">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${user.gender === 'homme' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                {user.gender || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {user.date_of_birth ? format(new Date(user.date_of_birth), 'dd/MM/yyyy') : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                              {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="motm">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gestion des votes MOTM</h3>
                <p className="text-gray-600 mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
                  ℹ️ Les votes s'ouvrent automatiquement 30 min avant la fin théorique et se ferment 60 min après.
                </p>
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Statistiques de vote à venir</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Bannière publicitaire</h3>
                  <p className="text-gray-600 mb-4">
                    Configuration de la bannière publicitaire du site
                  </p>
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                    Configurer la bannière
                  </Button>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-500" />
                    Journaux d'audit
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {auditLogs.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Aucun journal d'audit</p>
                    ) : (
                      auditLogs.map(log => (
                        <div key={log.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-primary-blue font-bold">{log.action}</span>
                            <span className="text-gray-400 text-xs">
                              {new Date(log.timestamp).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <div className="text-gray-600 text-xs font-mono">
                            Admin ID: {log.admin_id}
                          </div>
                          {log.details && (
                            <div className="text-gray-500 text-xs mt-1 bg-gray-50 p-1 rounded">
                              {log.details}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;