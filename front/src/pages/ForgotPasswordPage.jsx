import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { requestPasswordReset, resetPassword } from '@/api/userService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [identifier, setIdentifier] = useState('');
  const [token, setToken] = useState(''); // Simulated token input for demo
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call
    const result = await requestPasswordReset(identifier);
    setLoading(false);
    
    if (result.success) {
      setMessage(result.message);
      // For demo purposes, we auto-fill the token if returned in debug mode
      if (result.debugToken) {
        setToken(result.debugToken);
        alert(`DEMO: Votre token de réinitialisation est: ${result.debugToken}`);
      }
      setStep(2);
    } else {
      setError('Une erreur est survenue.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await resetPassword(token, newPassword);
    setLoading(false);

    if (result.success) {
      setStep(3); // Success state
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Réinitialisation - Tournoi de Douala 2026</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-primary-blue" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                <p className="text-gray-500 text-center text-sm">
                  Entrez votre téléphone ou email pour recevoir un lien de réinitialisation.
                </p>
                <div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-blue outline-none"
                    placeholder="Téléphone ou Email"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary-blue py-6">
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm mb-4">
                  {message}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Token (reçu par message)</label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-blue outline-none font-mono"
                    placeholder="Collez le token ici"
                  />
                </div>
                <div>
                   <label className="block text-gray-700 text-sm font-bold mb-2">Nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-blue outline-none"
                    placeholder="Nouveau mot de passe"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary-blue py-6">
                  {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                </Button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mot de passe mis à jour !</h3>
                <Link to="/login">
                  <Button className="w-full bg-primary-blue py-6">
                    Se connecter <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link to="/login" className="text-gray-500 hover:text-gray-900 text-sm">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ForgotPasswordPage;