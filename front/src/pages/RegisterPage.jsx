import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Phone, User, Calendar, Lock, Mail, AlertCircle, ChevronDown, Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import * as yup from 'yup';

// Schéma de validation Yup
const registerSchema = yup.object().shape({
  firstname: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne peut contenir que des lettres'),
  
  name: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne peut contenir que des lettres'),
  
  phone: yup
    .string()
    .required('Le numéro de téléphone est requis')
    .min(6, 'Le numéro doit contenir au moins 6 chiffres')
    .max(15, 'Le numéro ne peut pas dépasser 15 chiffres')
    .matches(/^\d+$/, 'Le numéro ne peut contenir que des chiffres'),
  
  email: yup
    .string()
    .nullable()
    .email('Format d\'email invalide')
    .transform((value) => (value === '' ? null : value)),
  
  dateOfBirth: yup
    .string()
    .required('La date de naissance est requise')
    .test('age', 'Vous devez avoir au moins 16 ans', (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 16;
      }
      return age >= 16;
    }),
  
  gender: yup
    .string()
    .required('Le genre est requis')
    .oneOf(['homme', 'femme'], 'Valeur invalide'),
  
  password: yup
    .string()
    .required('Le Code PIN est requis')
    .length(4, 'Le Code PIN doit être exactement 4 chiffres')
    .matches(/^\d{4}$/, 'Le Code PIN doit contenir uniquement 4 chiffres')
});

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    name: '',
    phone: '',
    countryCode: '+237',
    email: '',
    dateOfBirth: '',
    gender: 'homme',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Récupérer les pays depuis l'API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des pays');
        }

        const data = await response.json();
        
        const formattedCountries = data
          .filter(country => country.idd?.root && country.idd?.suffixes)
          .map(country => {
            const root = country.idd.root || '';
            const suffix = country.idd.suffixes?.[0] || '';
            const fullCode = root + suffix;
            const flag = country.flags?.png || country.flags?.svg || '';
            
            return {
              code: fullCode,
              country: country.name?.common || 'Nom inconnu',
              flag: flag,
              cca2: country.cca2?.toLowerCase() || ''
            };
          })
          .filter(country => country.code)
          .sort((a, b) => a.country.localeCompare(b.country));

        setCountries(formattedCountries);

        const defaultCountryExists = formattedCountries.some(c => c.code === '+237');
        if (!defaultCountryExists && formattedCountries.length > 0) {
          setFormData(prev => ({ ...prev, countryCode: formattedCountries[0].code }));
        }

      } catch (error) {
        console.error('Erreur lors du chargement des pays:', error);
        setError('Impossible de charger la liste des pays. Veuillez rafraîchir la page.');
        
        setCountries([
          { code: '+237', country: 'Cameroun', flag: '🇨🇲', cca2: 'cm' },
          { code: '+225', country: "Côte d'Ivoire", flag: '🇨🇮', cca2: 'ci' },
          { code: '+221', country: 'Sénégal', flag: '🇸🇳', cca2: 'sn' },
          { code: '+33', country: 'France', flag: '🇫🇷', cca2: 'fr' },
          { code: '+1', country: 'États-Unis', flag: '🇺🇸', cca2: 'us' },
        ]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fonction pour valider un champ spécifique
  const validateField = async (name, value) => {
    try {
      const fieldSchema = yup.reach(registerSchema, name);
      await fieldSchema.validate(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      setErrors(prev => ({ ...prev, [name]: error.message }));
      return false;
    }
  };

  // Fonction pour valider tous les champs
  const validateForm = async () => {
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Gestionnaire de changement avec validation
  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    // Gestion spéciale pour le téléphone (que des chiffres)
    let processedValue = name === 'phone' ? value.replace(/\D/g, '') : value;
    
    // Gestion spéciale pour le mot de passe (que 4 chiffres)
    if (name === 'password') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Valider le champ si déjà touché
    if (touched[name]) {
      await validateField(name, processedValue);
    }
  };

  // Gestionnaire de blur (perte de focus)
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    await validateField(name, value);
  };

  // Vérifier la validité du mot de passe (exactement 4 chiffres)
  const checkPasswordStrength = (password) => {
    const isValid = /^\d{4}$/.test(password);
    const checks = {
      length: password.length === 4,
      digits: /^\d+$/.test(password),
      complete: isValid
    };
    
    return {
      checks,
      strength: isValid ? 'valide' : 'invalide'
    };
  };

  const passwordStrength = formData.password ? checkPasswordStrength(formData.password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Marquer tous les champs comme touchés
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Valider le formulaire
    const isValid = await validateForm();
    
    if (!isValid) {
      return;
    }

    setLoading(true);

    const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
    const dataToSubmit = {
      ...formData,
      phone: fullPhoneNumber
    };

    const result = await register(dataToSubmit);
    
    setLoading(false);

    if (result.success) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.error || 'Erreur lors de l\'inscription');
    }
  };

  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0] || { code: '+237', country: 'Cameroun', flag: '🇨🇲' };

  const filteredCountries = countries.filter(country => 
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonction pour obtenir l'emoji drapeau
  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  return (
    <>
      <Helmet>
        <title>Inscription - Tournoi de Douala 2026</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary-blue" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
              <p className="text-gray-500 text-sm mt-2">Rejoignez la compétition maintenant</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${
                        errors.firstname && touched.firstname
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue/20'
                      } focus:ring-2 outline-none text-sm`}
                      placeholder="Prénom"
                    />
                  </div>
                  {errors.firstname && touched.firstname && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${
                        errors.name && touched.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue/20'
                      } focus:ring-2 outline-none text-sm`}
                      placeholder="Nom"
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative flex country-dropdown">
                  <div className="relative mr-2">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      disabled={loadingCountries}
                      className="h-[42px] px-3 bg-gray-50 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingCountries ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      ) : (
                        <>
                          {selectedCountry.flag ? (
                            typeof selectedCountry.flag === 'string' && selectedCountry.flag.startsWith('http') ? (
                              <img 
                                src={selectedCountry.flag} 
                                alt={selectedCountry.country}
                                className="w-5 h-5 object-cover rounded-sm"
                              />
                            ) : (
                              <span className="text-lg">{selectedCountry.flag}</span>
                            )
                          ) : (
                            <span className="text-lg">{getFlagEmoji(selectedCountry.cca2)}</span>
                          )}
                          <span className="text-sm font-medium code-pays">{selectedCountry.code}</span>
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </>
                      )}
                    </button>

                    {showCountryDropdown && !loadingCountries && (
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Rechercher un pays ou indicatif..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/20 outline-none"
                              autoFocus
                            />
                          </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <button
                                key={`${country.code}-${country.country}`}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, countryCode: country.code });
                                  setShowCountryDropdown(false);
                                  setSearchTerm('');
                                }}
                                className={`w-full px-3 py-2.5 flex items-center code-pays gap-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-0 ${
                                  country.code === formData.countryCode ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="w-6 flex justify-center">
                                  {country.flag ? (
                                    typeof country.flag === 'string' && country.flag.startsWith('http') ? (
                                      <img 
                                        src={country.flag} 
                                        alt={country.country}
                                        className="w-5 h-5 object-cover rounded-sm"
                                      />
                                    ) : (
                                      <span className="text-lg">{country.flag}</span>
                                    )
                                  ) : (
                                    <span className="text-lg">{getFlagEmoji(country.cca2)}</span>
                                  )}
                                </div>
                                <span className="text-sm flex-1 country-name">{country.country}</span>
                                <span className="text-sm font-medium text-gray-600">{country.code}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-8 text-center text-gray-500 text-sm">
                              Aucun pays trouvé pour "{searchTerm}"
                            </div>
                          )}
                        </div>
                        
                        <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
                          {filteredCountries.length} pays trouvés
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${
                        errors.phone && touched.phone
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue/20'
                      } focus:ring-2 outline-none text-sm`}
                      placeholder="Numéro sans indicatif"
                    />
                  </div>
                </div>
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Email (Optionnel)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${
                      errors.email && touched.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue/20'
                    } focus:ring-2 outline-none text-sm`}
                    placeholder="exemple@email.com"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${
                        errors.dateOfBirth && touched.dateOfBirth
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue/20'
                      } focus:ring-2 outline-none text-sm`}
                    />
                  </div>
                  {errors.dateOfBirth && touched.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Genre <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-3 pr-3 py-2.5 rounded-lg border ${
                      errors.gender && touched.gender
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue/20'
                    } focus:ring-2 outline-none text-sm bg-white`}
                  >
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                  {errors.gender && touched.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Code PIN  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength="4"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${
                      errors.password && touched.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue/20'
                    } focus:ring-2 outline-none text-sm`}
                    placeholder="4 chiffres uniquement"
                    inputMode="numeric"
                  />
                </div>
                
                {/* Indicateur de validité du mot de passe */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength?.strength === 'valide' ? 'bg-green-500 w-full' :
                            'bg-red-500 w-1/3'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength?.strength === 'valide' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength?.strength === 'valide' ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Valide
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Invalide
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        {passwordStrength?.checks.length ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className={passwordStrength?.checks.length ? 'text-green-600' : 'text-red-600'}>
                          Exactement 4 caractères
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {passwordStrength?.checks.digits ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className={passwordStrength?.checks.digits ? 'text-green-600' : 'text-red-600'}>
                          Seulement des chiffres (0-9)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || loadingCountries}
                className="w-full bg-primary-blue hover:bg-blue-800 text-white py-6 text-lg font-bold rounded-lg shadow-md hover:shadow-lg transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création...
                  </span>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary-blue font-bold hover:underline">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default RegisterPage;