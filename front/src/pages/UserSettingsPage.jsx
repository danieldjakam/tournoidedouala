import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  User, 
  Settings, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Save, 
  X,
  ChevronRight,
  Shield,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Edit2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/layout/Sidebar";
import { updateUserProfile } from '@/api/userService';
import { useToast } from '@/components/ui/use-toast';

const UserSettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("settings");
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // États pour les différents paramètres
  const [profileData, setProfileData] = useState({
    firstname: currentUser?.firstname || '',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    gender: currentUser?.gender || ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    matchResults: true,
    newMatches: true,
    leaderboardUpdates: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'light'
  });

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Gestion de la modification du profil
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const result = await updateUserProfile(currentUser.id, profileData);
      
      if (result.success) {
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées avec succès.",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Gestion du changement de mot de passe
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast({
        title: "Champ requis",
        description: "Veuillez entrer votre mot de passe actuel",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 4) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 4 caractères",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    // TODO: Implémenter l'API de changement de mot de passe
    setTimeout(() => {
      toast({
        title: "Mot de passe changé",
        description: "Votre mot de passe a été modifié avec succès.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }, 1000);
  };

  // Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Sections de paramètres
  const settingsSections = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Préférences', icon: Settings },
  ];

  if (!currentUser) return null;

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#023e78]">Informations Personnelles</h3>
                <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-[#023e78] hover:bg-[#023e78]/10 rounded-xl transition-colors"
                >
                  <Edit2 size={16} />
                  <span className="text-sm font-medium">Modifier</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        firstname: currentUser?.firstname || '',
                        name: currentUser?.name || '',
                        email: currentUser?.email || '',
                        phone: currentUser?.phone || '',
                        dateOfBirth: currentUser?.dateOfBirth || '',
                        gender: currentUser?.gender || ''
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={16} />
                    <span className="text-sm font-medium">Annuler</span>
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#023e78] text-white rounded-xl hover:bg-[#034b8c] transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span className="text-sm font-medium">{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                    <User size={14} /> Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                      value={profileData.firstname}
                      onChange={e => setProfileData({...profileData, firstname: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-1">{currentUser.firstname}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                    <User size={14} /> Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                      value={profileData.name}
                      onChange={e => setProfileData({...profileData, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-1">{currentUser.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                    <Mail size={14} /> Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                      value={profileData.email}
                      onChange={e => setProfileData({...profileData, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-1">{currentUser.email || 'Non renseigné'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                    <Phone size={14} /> Téléphone
                  </label>
                  <p className="text-gray-900 font-medium mt-1">{currentUser.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                    <Calendar size={14} /> Date de naissance
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                      value={profileData.dateOfBirth}
                      onChange={e => setProfileData({...profileData, dateOfBirth: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium mt-1">
                      {currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toLocaleDateString('fr-FR') : 'Non renseignée'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                    <User size={14} /> Genre
                  </label>
                  {isEditing ? (
                    <select
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                      value={profileData.gender}
                      onChange={e => setProfileData({...profileData, gender: e.target.value})}
                    >
                      <option value="">Sélectionner</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium mt-1 capitalize">{currentUser.gender || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#023e78]">Sécurité du compte</h3>
              <p className="text-sm text-gray-500">Gérez votre mot de passe et la sécurité de votre compte</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                  <Lock size={14} /> Mot de passe actuel
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                  placeholder="••••"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                  <Lock size={14} /> Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                  placeholder="••••"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-2">
                  <Lock size={14} /> Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                  placeholder="••••"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#023e78] text-white rounded-xl hover:bg-[#034b8c] transition-colors disabled:opacity-50"
              >
                <Shield size={16} />
                <span className="text-sm font-medium">{loading ? 'Changement...' : 'Changer le mot de passe'}</span>
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#f71a18] border-2 border-[#f71a18]/20 rounded-xl hover:bg-[#f71a18]/10 transition-colors"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#023e78]">Notifications</h3>
              <p className="text-sm text-gray-500">Gérez vos préférences de notification</p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Notifications par email', description: 'Recevoir des emails pour les mises à jour importantes' },
                { key: 'pushNotifications', label: 'Notifications push', description: 'Recevoir des notifications sur votre appareil' },
                { key: 'matchResults', label: 'Résultats des matchs', description: 'Être notifié des résultats des matchs' },
                { key: 'newMatches', label: 'Nouveaux matchs', description: 'Être informé des nouveaux matchs ajoutés' },
                { key: 'leaderboardUpdates', label: 'Mises à jour du classement', description: 'Recevoir des notifications sur les changements de classement' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key]})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key] ? 'bg-[#023e78]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notifications[item.key] ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#023e78]">Préférences</h3>
              <p className="text-sm text-gray-500">Personnalisez votre expérience</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Globe size={20} className="text-[#023e78]" />
                  <p className="font-medium text-gray-900">Langue</p>
                </div>
                <select
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78]/20 focus:border-[#023e78]"
                  value={preferences.language}
                  onChange={e => setPreferences({...preferences, language: e.target.value})}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Palette size={20} className="text-[#023e78]" />
                  <p className="font-medium text-gray-900">Thème</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPreferences({...preferences, theme: 'light'})}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      preferences.theme === 'light'
                        ? 'border-[#023e78] bg-[#023e78]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">Clair</p>
                    <p className="text-sm text-gray-500">Thème par défaut</p>
                  </button>
                  <button
                    onClick={() => setPreferences({...preferences, theme: 'dark'})}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      preferences.theme === 'dark'
                        ? 'border-[#023e78] bg-[#023e78]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">Sombre</p>
                    <p className="text-sm text-gray-500">Bientôt disponible</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Paramètres - Tournoi 2026</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0f5fe] relative">
        {/* Éléments décoratifs de fond */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#023e78]/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f71a18]/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileMenuOpen={false}
          setIsMobileMenuOpen={() => {}}
        />

        {/* Contenu principal */}
        <main className={`
          transition-all duration-300
          ${isMobile ? 'pt-20 px-4 pb-8' : 'ml-72 p-6 lg:p-8'}
        `}>
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#023e78] flex items-center gap-3">
              <Settings size={28} />
              Paramètres
            </h1>
            <p className="text-gray-500 mt-1">Gérez votre compte et vos préférences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navigation latérale des sections */}
            <div className="lg:col-span-1">
              <nav className="space-y-2 sticky top-4">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                        activeSection === section.id
                          ? 'bg-[#023e78] text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-[#f0f5fe]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span className="font-medium text-sm">{section.label}</span>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Contenu de la section */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-[#023e78]/10 p-6 lg:p-8">
                {renderSection()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserSettingsPage;
