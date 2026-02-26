import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Phone, User, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const UserRegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: 'homme'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);
    
    setLoading(false);

    if (result.success) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inscription - Tournoi de Douala 2026</title>
        <meta name="description" content="Inscrivez-vous au tournoi de football 2026 et commencez à faire vos prédictions" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Inscription
                </h1>
                <p className="text-gray-400">
                  Rejoignez le tournoi de football 2026
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                      className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Date de naissance
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Vous devez avoir au moins 13 ans
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Sexe
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="+237XXXXXXXXX"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Format: +237 suivi de 9 chiffres
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <h4 className="text-white font-semibold mb-2 text-sm">Informations</h4>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Maximum 3 tentatives d'inscription par heure</li>
                  <li>• Un seul compte par numéro de téléphone</li>
                  <li>• Format camerounais requis (+237)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default UserRegistrationPage;