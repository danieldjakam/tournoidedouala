import { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  User, Mail, Phone, Calendar, MapPin, Shield, LogOut, Edit2, Save, X,
  Camera, Award, Target, Trophy, TrendingUp, ChevronRight, Star,
  Activity, History, Settings, ArrowLeft, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '@/api/userService';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import Sidebar from "../components/layout/Sidebar";

const UserProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSectionMenu, setShowMobileSectionMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    firstname: currentUser?.firstname || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    gender: currentUser?.gender || '',
    date_of_birth: currentUser?.date_of_birth || ''
  });
  const { toast } = useToast();

  const userStats = {
    totalPoints: currentUser?.points || 0,
    rank: currentUser?.rank || 0,
    predictions: currentUser?.predictions_count || 0,
    accuracy: currentUser?.accuracy || 0
  };

  const handleUpdate = async () => {
    const result = await updateUserProfile(currentUser.id, formData);
    if (result.success) {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès."
      });
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1000);
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

  if (!currentUser) return null;

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
          
          {/* Mobile Section Menu Dropdown */}
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

        {/* Sidebar - Hidden on mobile */}
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
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-[#023e78] to-[#023e78]/80 bg-clip-text text-transparent">
                        {currentUser.firstname?.charAt(0) || currentUser.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#f71a18] hover:bg-[#f71a18]/90 text-white rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white">
                    <Camera size={14} className="sm:w-4 md:w-5" />
                  </button>
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-2 sm:mt-3 line-clamp-1 px-2 my-2">
                  {currentUser.firstname} {currentUser.name}
                </h1>
                {/* <p className="text-blue-100 text-xs sm:text-sm mt-1">
                  {currentUser.pseudo || 'Membre du Tournoi'}
                </p> */}
                {/* <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full max-w-[200px] sm:max-w-none truncate block">
                    {currentUser.email || 'Email non renseigné'}
                  </span>
                </div> */}
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
              {/* Sidebar Navigation - Hidden on mobile, shown on desktop */}
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
                                date_of_birth: currentUser?.date_of_birth || ''
                              });
                            }}
                            className="flex-1 sm:flex-none"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={handleUpdate}
                            className="bg-[#f71a18] hover:bg-[#f71a18]/90 text-white flex-1 sm:flex-none"
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
                            >
                              <option value="">Sélectionner</option>
                              <option value="male">Masculin</option>
                              <option value="female">Féminin</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                              <User size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              <p className="text-gray-900 font-medium text-sm sm:text-base capitalize">{currentUser.gender || 'Non renseigné'}</p>
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
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                              <Calendar size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                              <p className="text-gray-900 font-medium text-sm sm:text-base">
                                {currentUser.date_of_birth
                                  ? format(new Date(currentUser.date_of_birth), 'dd/MM/yyyy')
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
                        <Button className="bg-[#023e78] hover:bg-[#023e78]/90 text-white w-full sm:w-auto text-sm sm:text-base">
                          <Shield className="w-4 h-4 mr-2" /> Changer le mot de passe
                        </Button>
                      </div>

                      {/* Notifications */}
                      <div className="bg-gradient-to-r from-[#f71a18]/10 to-[#f71a18]/5 rounded-xl p-4 sm:p-5 border border-[#f71a18]/20">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#f71a18] flex items-center justify-center flex-shrink-0">
                            <Settings size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                            <p className="text-xs sm:text-sm text-gray-500">Gérez vos préférences de notification</p>
                          </div>
                        </div>
                        <Button className="bg-[#f71a18] hover:bg-[#f71a18]/90 text-white w-full sm:w-auto text-sm sm:text-base">
                          <Settings className="w-4 h-4 mr-2" /> Paramètres de notification
                        </Button>
                      </div>

                      {/* Privacy */}
                      <div className="bg-gradient-to-r from-[#023e78]/5 to-[#f71a18]/5 rounded-xl p-4 sm:p-5 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#023e78] to-[#f71a18] flex items-center justify-center flex-shrink-0">
                            <Shield size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Confidentialité</h3>
                            <p className="text-xs sm:text-sm text-gray-500">Contrôlez qui peut voir vos informations</p>
                          </div>
                        </div>
                        <Button className="bg-gradient-to-r from-[#023e78] to-[#f71a18] hover:from-[#023e78]/90 hover:to-[#f71a18]/90 text-white w-full sm:w-auto text-sm sm:text-base">
                          <Shield className="w-4 h-4 mr-2" /> Paramètres de confidentialité
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Section */}
                {activeSection === 'activity' && (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Activité Récente</h2>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">Consultez votre historique de pronostics</p>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-center py-8 sm:py-12">
                        <div className="text-center px-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#023e78]/10 to-[#f71a18]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History size={32} className="sm:w-10 sm:h-10 text-[#023e78]" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Historique d'activité</h3>
                          <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
                            Vos pronostics et votes récents apparaîtront ici. Continuez à participer pour voir votre activité !
                          </p>
                          <Button
                            onClick={() => navigate('/matches')}
                            className="mt-4 bg-[#023e78] hover:bg-[#023e78]/90 text-white text-sm sm:text-base"
                          >
                            <Target className="w-4 h-4 mr-2" /> Faire un pronostic
                          </Button>
                        </div>
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
