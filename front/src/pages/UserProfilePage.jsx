import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  User, Mail, Phone, Calendar, MapPin, Shield, LogOut, Edit2, Save, X,
  Camera, Award, Target, Trophy, TrendingUp, ChevronRight, Star,
  Activity, History, Settings, ArrowLeft, Menu, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  updateUserProfile, 
  uploadAvatar, 
  deleteAvatar, 
  changePassword,
  getUserActivity,
  getUserStats 
} from '@/api/userService';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import Sidebar from "../components/layout/Sidebar";

const UserProfilePage = () => {
  const { currentUser, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSectionMenu, setShowMobileSectionMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activityData, setActivityData] = useState(null);
  const [userStats, setUserStats] = useState({
    totalPoints: currentUser?.points || 0,
    rank: 0,
    predictions: 0,
    accuracy: 0
  });
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    firstname: currentUser?.firstname || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    gender: currentUser?.gender || '',
    date_of_birth: currentUser?.dateOfBirth || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { toast } = useToast();

  // Charger les statistiques et l'activité au montage
  useEffect(() => {
    if (currentUser) {
      loadStats();
      loadActivity();
    }
  }, [currentUser]);

  const loadStats = async () => {
    try {
      const result = await getUserStats();
      if (result.success) {
        setUserStats({
          totalPoints: result.stats.total_points || currentUser?.points || 0,
          rank: result.stats.rank || 0,
          predictions: result.stats.predictions_count || 0,
          accuracy: result.stats.accuracy || 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadActivity = async () => {
    try {
      const result = await getUserActivity();
      if (result.success) {
        setActivityData(result);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const result = await updateUserProfile(currentUser.id, formData);
    setLoading(false);
    
    if (result.success) {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
        variant: "default"
      });
      setIsEditing(false);
      loadStats();
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "L'image ne doit pas dépasser 2 Mo",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Type de fichier invalide",
        description: "Veuillez sélectionner une image",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await uploadAvatar(file);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été changée avec succès",
        variant: "default"
      });
      // Force reload to update avatar everywhere
      window.location.reload();
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre avatar ?')) return;

    setLoading(true);
    const result = await deleteAvatar();
    setLoading(false);

    if (result.success) {
      toast({
        title: "Avatar supprimé",
        description: "Votre photo de profil a été supprimée",
        variant: "default"
      });
      window.location.reload();
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.new_password.length !== 4 || !/^\d+$/.test(passwordData.new_password)) {
      toast({
        title: "Format invalide",
        description: "Le mot de passe doit contenir exactement 4 chiffres",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await changePassword(
      passwordData.current_password,
      passwordData.new_password,
      passwordData.confirm_password
    );
    setLoading(false);

    if (result.success) {
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été changé avec succès",
        variant: "default"
      });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setShowPasswordForm(false);
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (!currentUser || authLoading) return null;

  const statsCards = [
    { title: "Points", value: userStats.totalPoints, icon: Trophy, color: "from-[#023e78] to-[#023e78]/80", bgColor: "bg-white" },
    { title: "Classement", value: userStats.rank > 0 ? `#${userStats.rank}` : '-', icon: Award, color: "from-[#f71a18] to-[#f71a18]/80", bgColor: "bg-white" },
    { title: "Pronostics", value: userStats.predictions, icon: Target, color: "from-[#023e78]/70 to-[#023e78]/50", bgColor: "bg-white" },
    { title: "Précision", value: `${userStats.accuracy}%`, icon: TrendingUp, color: "from-[#f71a18]/80 to-[#f71a18]/60", bgColor: "bg-white" },
  ];

  const profileSections = [
    { id: 'personal', label: 'Infos Perso', icon: User },
    { id: 'account', label: 'Compte', icon: Shield },
    { id: 'activity', label: 'Activité', icon: Activity },
  ];

  const getAvatarUrl = () => {
    return currentUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.firstname?.charAt(0) || 'U')}+${encodeURIComponent(currentUser?.name?.charAt(0) || '')}&background=023e78&color=fff&size=200`;
  };

  return (
    <>
      <Helmet>
        <title>Mon Profil - Tournoi de Douala 2026</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-40 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-[#023e78] hover:bg-[#023e78]/10 px-3 py-2 rounded-xl transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="font-bold text-gray-900 text-base">Mon Profil</h1>
            </div>
            <button
              onClick={() => setShowMobileSectionMenu(!showMobileSectionMenu)}
              className="flex items-center gap-2 text-[#023e78] hover:bg-[#023e78]/10 px-3 py-2 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>

          {showMobileSectionMenu && (
            <div className="border-t border-gray-200 bg-white px-4 py-3 space-y-2">
              {profileSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setShowMobileSectionMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[#023e78] to-[#023e78]/80 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{section.label}</span>
                    {activeSection === section.id && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-[#f71a18] hover:bg-[#f71a18]/5 transition-all"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Déconnexion</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeTab="dashboard"
            setActiveTab={() => {}}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>

        {/* Main Content */}
        <main className={`${!isMobileMenuOpen ? 'md:ml-72' : ''} pt-14 md:pt-0 pb-8`}>
          {/* Profile Header Banner */}
          <div className="relative h-40 sm:h-56 md:h-64 bg-gradient-to-r from-[#023e78] via-[#023e78] to-[#023e78]/90 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }}></div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-[#f71a18]/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 h-full flex items-end justify-center pb-4 sm:pb-6 md:pb-8">
              <div className="text-center px-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#f71a18] via-[#f71a18]/90 to-[#f71a18]/80 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden">
                      <img
                        src={getAvatarUrl()}
                        alt={currentUser.firstname}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* <label className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#f71a18] hover:bg-[#f71a18]/90 text-white rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white cursor-pointer">
                    <Camera size={14} className="sm:w-4 md:w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={loading}
                    />
                  </label> */}
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-2 sm:mt-3 line-clamp-1 px-2 my-2">
                  {currentUser.firstname} {currentUser.name}
                </h1>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-4 sm:px-6 md:px-8 -mt-4 sm:-mt-6 relative z-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className={`${stat.bgColor} backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-[#023e78]/10 hover:shadow-xl transition-shadow`}>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 sm:mb-3 shadow-md`}>
                      <Icon size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <p className="text-gray-500 text-xs font-medium">{stat.title}</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-4 sm:px-6 md:px-8 mt-4 sm:mt-6 md:mt-8">
            <div className="flex flex-col md:grid md:grid-cols-4 gap-4 sm:gap-6">
              {/* Sidebar Navigation */}
              <div className="hidden md:block lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sticky top-6">
                  <nav className="space-y-2">
                    {profileSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-[#023e78] to-[#023e78]/80 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={18} />
                          <span className="font-medium text-sm">{section.label}</span>
                          {activeSection === section.id && (
                            <ChevronRight size={16} className="ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </nav>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start text-[#f71a18] border-[#f71a18]/20 hover:bg-[#f71a18]/5 hover:text-[#f71a18]"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3">
                {/* Personal Information Section */}
                {activeSection === 'personal' && (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Informations Personnelles</h2>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Gérez vos informations personnelles</p>
                      </div>
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-[#023e78] hover:bg-[#023e78]/90 text-white text-sm sm:text-base w-full sm:w-auto"
                        >
                          <Edit2 className="w-4 h-4 mr-2" /> Modifier
                        </Button>
                      ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                name: currentUser?.name || '',
                                firstname: currentUser?.firstname || '',
                                email: currentUser?.email || '',
                                phone: currentUser?.phone || '',
                                gender: currentUser?.gender || '',
                                date_of_birth: currentUser?.dateOfBirth || ''
                              });
                            }}
                            className="flex-1 sm:flex-none"
                            disabled={loading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={handleUpdate}
                            className="bg-[#f71a18] hover:bg-[#f71a18]/90 text-white flex-1 sm:flex-none"
                            disabled={loading}
                          >
                            <Save className="w-4 h-4 mr-2" /> Enregistrer
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Prénom */}
                        <div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 uppercase font-semibold mb-2">
                            <User size={14} /> Prénom
                          </label>
                          {isEditing ? (
                            <input
                              className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78] focus:border-transparent transition-all"
                              value={formData.firstname}
                              onChange={e => setFormData({...formData, firstname: e.target.value})}
                              disabled={loading}
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                              <User size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              <p className="text-gray-900 font-medium text-sm sm:text-base truncate">{currentUser.firstname}</p>
                            </div>
                          )}
                        </div>

                        {/* Nom */}
                        <div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 uppercase font-semibold mb-2">
                            <User size={14} /> Nom
                          </label>
                          {isEditing ? (
                            <input
                              className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78] focus:border-transparent transition-all"
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              disabled={loading}
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                              <User size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              <p className="text-gray-900 font-medium text-sm sm:text-base truncate">{currentUser.name}</p>
                            </div>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 uppercase font-semibold mb-2">
                            <Mail size={14} /> Email
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78] focus:border-transparent transition-all"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                              disabled={loading}
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                              <Mail size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              <p className="text-gray-900 font-medium text-sm sm:text-base truncate">{currentUser.email || 'Non renseigné'}</p>
                            </div>
                          )}
                        </div>

                        {/* Téléphone */}
                        <div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 uppercase font-semibold mb-2">
                            <Phone size={14} /> Téléphone
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78] focus:border-transparent transition-all"
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              disabled={loading}
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                              <Phone size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              <p className="text-gray-900 font-medium text-sm sm:text-base truncate">{currentUser.phone || 'Non renseigné'}</p>
                            </div>
                          )}
                        </div>

                        {/* Sexe */}
                        <div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 uppercase font-semibold mb-2">
                            <User size={14} /> Sexe
                          </label>
                          {isEditing ? (
                            <select
                              className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78] focus:border-transparent transition-all"
                              value={formData.gender}
                              onChange={e => setFormData({...formData, gender: e.target.value})}
                              disabled={loading}
                            >
                              <option value="">Sélectionner</option>
                              <option value="homme">Masculin</option>
                              <option value="femme">Féminin</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                              <User size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              <p className="text-gray-900 font-medium text-sm sm:text-base capitalize">{currentUser.gender === 'homme' ? 'Masculin' : currentUser.gender === 'femme' ? 'Féminin' : 'Non renseigné'}</p>
                            </div>
                          )}
                        </div>

                        {/* Date de naissance */}
                        <div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 uppercase font-semibold mb-2">
                            <Calendar size={14} /> Date de naissance
                          </label>
                          {isEditing ? (
                            <input
                              type="date"
                              className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78] focus:border-transparent transition-all"
                              value={formData.date_of_birth}
                              onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                              disabled={loading}
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                              <Calendar size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              <p className="text-gray-900 font-medium text-sm sm:text-base">
                                {currentUser.dateOfBirth
                                  ? format(new Date(currentUser.dateOfBirth), 'dd/MM/yyyy')
                                  : 'Non renseigné'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account & Security Section */}
                {activeSection === 'account' && (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Compte & Sécurité</h2>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">Gérez votre mot de passe et les paramètres de sécurité</p>
                    </div>

                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      {/* Change Password */}
                      <div className="bg-gradient-to-r from-[#023e78]/10 to-[#023e78]/5 rounded-xl p-4 sm:p-5 border border-[#023e78]/20">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#023e78] flex items-center justify-center flex-shrink-0">
                            <Shield size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Mot de passe</h3>
                            <p className="text-xs sm:text-sm text-gray-500">Changez votre mot de passe régulièrement</p>
                          </div>
                        </div>
                        
                        {!showPasswordForm ? (
                          <Button 
                            onClick={() => setShowPasswordForm(true)}
                            className="bg-[#023e78] hover:bg-[#023e78]/90 text-white w-full sm:w-auto text-sm sm:text-base"
                          >
                            Changer le mot de passe
                          </Button>
                        ) : (
                          <div className="space-y-3 mt-4">
                            <div>
                              <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Mot de passe actuel</label>
                              <input
                                type="password"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78]"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                placeholder="****"
                                maxLength={4}
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Nouveau mot de passe</label>
                              <input
                                type="password"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78]"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                placeholder="****"
                                maxLength={4}
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Confirmer le mot de passe</label>
                              <input
                                type="password"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#023e78]"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                placeholder="****"
                                maxLength={4}
                                disabled={loading}
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowPasswordForm(false);
                                  setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                                }}
                                className="flex-1"
                                disabled={loading}
                              >
                                Annuler
                              </Button>
                              <Button
                                onClick={handleChangePassword}
                                className="bg-[#f71a18] hover:bg-[#f71a18]/90 text-white flex-1"
                                disabled={loading}
                              >
                                <Save className="w-4 h-4 mr-2" /> Enregistrer
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Avatar Management */}
                      <div className="bg-gradient-to-r from-[#f71a18]/10 to-[#f71a18]/5 rounded-xl p-4 sm:p-5 border border-[#f71a18]/20">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#f71a18] flex items-center justify-center flex-shrink-0">
                            <Camera size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Photo de profil</h3>
                            <p className="text-xs sm:text-sm text-gray-500">Gérez votre avatar</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={handleDeleteAvatar}
                            className="text-[#f71a18] border-[#f71a18]/20 hover:bg-[#f71a18]/5"
                            disabled={loading}
                          >
                            Supprimer l'avatar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Section */}
                {activeSection === 'activity' && (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Activité Récente</h2>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">Historique de vos pronostics</p>
                    </div>

                    <div className="p-4 sm:p-6">
                      {/* Stats Summary */}
                      {activityData?.stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          <div className="bg-gradient-to-br from-[#023e78]/10 to-[#023e78]/5 rounded-xl p-3 text-center border border-[#023e78]/20">
                            <p className="text-2xl font-bold text-[#023e78]">{activityData.stats.total_votes || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Total votes</p>
                          </div>
                          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-3 text-center border border-green-500/20">
                            <p className="text-2xl font-bold text-green-600">{activityData.stats.correct_votes || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Votes corrects</p>
                          </div>
                          <div className="bg-gradient-to-br from-[#f71a18]/10 to-[#f71a18]/5 rounded-xl p-3 text-center border border-[#f71a18]/20">
                            <p className="text-2xl font-bold text-[#f71a18]">{activityData.stats.accuracy || 0}%</p>
                            <p className="text-xs text-gray-500 mt-1">Précision</p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-3 text-center border border-purple-500/20">
                            <p className="text-2xl font-bold text-purple-600">{userStats.totalPoints}</p>
                            <p className="text-xs text-gray-500 mt-1">Points totaux</p>
                          </div>
                        </div>
                      )}

                      {/* Match Votes */}
                      <div className="mb-6">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-3 flex items-center gap-2">
                          <Target size={18} className="text-[#023e78]" />
                          Pronostics Matchs
                        </h3>
                        {activityData?.activity?.match_votes && activityData.activity.match_votes.length > 0 ? (
                          <div className="space-y-2">
                            {activityData.activity.match_votes.slice(0, 10).map((vote) => (
                              <div key={vote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#023e78]/30 transition-colors">
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-gray-900">
                                    {vote.match?.team1} vs {vote.match?.team2}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Vote: {vote.team_vote} {vote.player_vote && `• Homme du match: ${vote.player_vote}`}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {format(new Date(vote.created_at), 'dd/MM/yyyy')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {vote.validated ? (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <CheckCircle size={16} />
                                      <span className="text-xs font-medium">+{vote.points}</span>
                                    </div>
                                  ) : vote.match?.statut === 'termine' ? (
                                    <div className="flex items-center gap-1 text-gray-400">
                                      <XCircle size={16} />
                                      <span className="text-xs">0</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-gray-400">
                                      <Clock size={16} />
                                      <span className="text-xs">En attente</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Activity size={48} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Aucun pronostic de match</p>
                          </div>
                        )}
                      </div>

                      {/* Tournament Votes */}
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-3 flex items-center gap-2">
                          <Trophy size={18} className="text-[#f71a18]" />
                          Pronostic Tournoi
                        </h3>
                        {activityData?.activity?.tournament_votes && activityData.activity.tournament_votes.length > 0 ? (
                          <div className="space-y-2">
                            {activityData.activity.tournament_votes.map((vote) => (
                              <div key={vote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#f71a18]/30 transition-colors">
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-gray-900">
                                    Vainqueur: {vote.team_vote}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {format(new Date(vote.created_at), 'dd/MM/yyyy')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {vote.validated ? (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <CheckCircle size={16} />
                                      <span className="text-xs font-medium">+{vote.points}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-gray-400">
                                      <Clock size={16} />
                                      <span className="text-xs">En attente</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Trophy size={48} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Aucun pronostic pour le tournoi</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfilePage;
