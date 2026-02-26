import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { User, Shield, LogOut, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { updateUserProfile } from '@/api/userService';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const UserProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    firstname: currentUser?.firstname || ''
  });
  const { toast } = useToast();

  const handleUpdate = async () => {
    const result = await updateUserProfile(currentUser.id, formData);
    if (result.success) {
      toast({ title: "Profil mis à jour" });
      setIsEditing(false);
      // Reload page or update context (Context updates handled in userService helper roughly, but ideally context should reload)
      window.location.reload(); 
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" });
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <Helmet>
        <title>Mon Profil - Tournoi de Douala 2026</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col pb-20 md:pb-0">
        <Header />

        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-primary-blue/10 p-8 text-center border-b border-gray-100">
              <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm border-4 border-white mb-4">
                <User className="w-12 h-12 text-primary-blue" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{currentUser.firstname} {currentUser.name}</h1>
              <p className="text-gray-500">{currentUser.phone}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Informations Personnelles</h3>
                {!isEditing ? (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={handleUpdate} className="bg-primary-blue text-white">
                      <Save className="w-4 h-4 mr-2" /> Enregistrer
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Prénom</label>
                    {isEditing ? (
                      <input 
                        className="w-full border rounded p-2 text-sm mt-1" 
                        value={formData.firstname}
                        onChange={e => setFormData({...formData, firstname: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{currentUser.firstname}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Nom</label>
                     {isEditing ? (
                      <input 
                        className="w-full border rounded p-2 text-sm mt-1" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{currentUser.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Sexe</label>
                    <p className="text-gray-900 font-medium capitalize">{currentUser.gender}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Date de naissance</label>
                    <p className="text-gray-900 font-medium">
                      {currentUser.date_of_birth ? format(new Date(currentUser.date_of_birth), 'dd/MM/yyyy') : '-'}
                    </p>
                  </div>
                </div>
                
                <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                   <p className="text-gray-900 font-medium">{currentUser.email || 'Non renseigné'}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-6 space-y-3">
                <Button variant="outline" className="w-full justify-start text-gray-700">
                  <Shield className="w-4 h-4 mr-3" /> Changer mon mot de passe
                </Button>
                <Button 
                  onClick={logout} 
                  variant="outline" 
                  className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-3" /> Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <BottomNavigation />
      </div>
    </>
  );
};

export default UserProfilePage;